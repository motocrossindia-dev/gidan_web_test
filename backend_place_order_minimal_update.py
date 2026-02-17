from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status
from account.permissions import DynamicPermission
from account.views.validate_user_profile import validate_user_profile
from dealoftheweek.models import DealOfTheWeek
from order.models import Cart, OrderItem
from order.view.admin_notification_for_stock import send_low_stock_alert
from product.models import Product
from combo.models import ComboOffer
from coupon.models import Coupon
from order.view.util import generate_bmo_id
from order.serializers import PlaceOrderSerializer, OrderItemSerializer
import time
from account.models import User
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP  # Import InvalidOperation for error handling
from utils.models import ShippingCharge, ShippingConfig


@api_view(['POST'])
@permission_classes([IsAuthenticated, DynamicPermission])
@authentication_classes([JWTAuthentication])
def place_order(request):
    print("📦 Received order request:", request.data)

    if request.method != 'POST':
        print("❌ Invalid request method")
        return Response({'message': 'Invalid request method'}, status=status.HTTP_400_BAD_REQUEST)

    required_permissions = ['order.add_order']
    if not any(request.user.has_perm(perm) for perm in required_permissions):
        print("❌ Permission denied for user:", request.user.username)
        return Response(data={'message': 'You do not have permission to perform this action.'},
                        status=status.HTTP_403_FORBIDDEN)

    # Validate user profile
    user_profile = validate_user_profile(request.user)
    print("✅ User profile validation result:", user_profile)

    if not user_profile.get('user_profile'):
        print("❌ User profile validation failed")
        return Response(data={
            'message': user_profile.get('message'),
            'profile_status': user_profile.get('profile_status'),
            'address_status': user_profile.get('address_status')
        }, status=status.HTTP_400_BAD_REQUEST)

    # Validate order source
    order_source = request.data.get('order_source')
    print("📋 Order source:", order_source)

    if order_source not in ['product', 'cart', 'combo', 'deal']:
        print("❌ Invalid order source:", order_source)
        return Response(data={'message': 'Invalid order source.'}, status=status.HTTP_400_BAD_REQUEST)

    order_items = []
    # Use Decimal for financial calculations to avoid floating point errors
    total_price = Decimal('0')
    total_discount = Decimal('0')
    is_combo_purchase = False
    is_shop_the_look = False
    shipping_info = None  # Initialize shipping_info

    # 🛒 Case 1: Single Product Purchase
    if order_source == 'product':
        product_id = request.data.get('prod_id')
        try:
            quantity = Decimal(request.data.get('quantity', '0'))
        except (InvalidOperation, TypeError):
            return Response({'message': 'Invalid quantity format.'}, status=status.HTTP_400_BAD_REQUEST)

        if not product_id or not quantity:
            return Response({'message': 'Product ID and quantity are required.'}, status=status.HTTP_400_BAD_REQUEST)

        product = Product.objects.filter(id=product_id).first()
        if not product:
            return Response({'message': 'Product not found.'}, status=status.HTTP_400_BAD_REQUEST)

        if product.stock < quantity:
            send_low_stock_alert(product)
            return Response({'message': 'Product out of stock.'}, status=status.HTTP_400_BAD_REQUEST)

        mrp = Decimal(str(product.mrp))
        discount_percent = Decimal(str(product.discount))

        total = (mrp * quantity).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        discount_amount = ((mrp * discount_percent / Decimal('100')) * quantity).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        discounted_total_amount = (total - discount_amount).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

        order_items.append({
            'product_id': product_id,
            'sku': product.sku,
            'quantity': int(quantity),
            'selling_price': product.selling_price,
            'mrp': mrp,
            'discount': discount_amount,
            'total': discounted_total_amount
        })

        total_price += total
        total_discount += discount_amount

        # Calculate shipping for single product
        shipping_items = [{"product": product, "qty": int(quantity)}]
        shipping_info = calculate_cart_shipping(shipping_items)

    # 🛒 Case 2: Cart Order
    elif order_source == 'cart':
        cart_items = Cart.objects.filter(user_id=request.user.id).all()
        print(f"🛒 Cart order: Found {len(cart_items)} items")

        if not cart_items:
            print("❌ Cart is empty")
            return Response(data={'message': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        shipping_items = []  # For shipping calculation

        for item in cart_items:
            if item.product_id.stock < item.quantity:
                send_low_stock_alert(item.product_id)
                print(f"❌ Product {item.product_id.name} is out of stock.")
                return Response(data={'message': f'Product {item.product_id.name} is out of stock.'},
                                status=status.HTTP_400_BAD_REQUEST)

            mrp = Decimal(str(item.product_id.mrp))
            total = Decimal(item.quantity) * mrp
            discount_amount = (mrp * Decimal(str(item.product_id.discount)) / Decimal('100')) * Decimal(item.quantity)

            discounted_total_amount = total - discount_amount

            order_items.append({
                'product_id': item.product_id.id,
                'sku': item.product_id.sku,
                'quantity': item.quantity,
                'selling_price': item.product_id.selling_price,
                'mrp': item.product_id.mrp,
                'discount': discount_amount,
                'total': discounted_total_amount
            })

            total_price += total
            total_discount += discount_amount

            # Add to shipping items
            shipping_items.append({"product": item.product_id, "qty": item.quantity})

        # Calculate shipping for cart items
        shipping_info = calculate_cart_shipping(shipping_items)

    elif order_source == 'combo':
        combo_id = request.data.get('combo_id')
        if not combo_id:
            return Response({'message': 'Combo offer ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        combo = ComboOffer.objects.filter(id=combo_id).first()
        if not combo:
            return Response({'message': 'Combo offer not found.'}, status=status.HTTP_400_BAD_REQUEST)

        is_shop_the_look = combo.is_shop_the_look
        is_combo_purchase = True

        shipping_items = []  # For shipping calculation

        for combo_product in combo.products.all():
            order_items.append({
                'product_id': combo_product.id,
                'sku': combo_product.sku,
                'quantity': 1,
                'selling_price': combo_product.selling_price,
                'mrp': combo_product.mrp,
                'discount': 0,  # handled at order level
                'total': combo_product.selling_price,
                'combo_offer': combo_id
            })

            # Add to shipping items
            shipping_items.append({"product": combo_product, "qty": 1})

        # Use combo level price/discount
        total_price = Decimal(str(combo.final_price)) + Decimal(str(combo.discount))
        total_discount = Decimal(str(combo.discount))

        # Calculate shipping for combo items
        shipping_info = calculate_cart_shipping(shipping_items)

    elif order_source == 'deal':
        deal_id = request.data.get('deal_id')
        print(f"🎯 Deal order: deal ID: {deal_id}")

        # 1. Check for missing deal_id
        if not deal_id:
            return Response(
                data={'message': 'Deal ID is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Fetch deal object
        deal_main_product = DealOfTheWeek.objects.filter(id=deal_id).first()
        if not deal_main_product:
            return Response(
                data={'message': 'Deal not found.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        print("✅ Deal product details:", deal_main_product)

        # 3. Get discount value
        if not deal_main_product.discount_percentage:
            return Response(
                data={'message': 'No discount configured for this deal.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        deal_discount = Decimal(str(deal_main_product.discount_percentage.discount))

        # 4. Get the linked main product (OneToOneField)
        main_product = deal_main_product.main_products
        if not main_product:
            return Response(
                data={'message': 'No main product linked to this deal.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # If you want to fetch actual products inside MainProduct
        products = Product.objects.filter(product_id=main_product.id)

        shipping_items = []  # For shipping calculation

        # 5. Loop through products
        for deal_product in products:
            sale_price = Decimal(str(deal_product.selling_price))
            discount = (sale_price * deal_discount / Decimal('100'))
            total = sale_price

            print(f"✅ Adding deal product: {deal_product.name}, Total: {total}, Discount: {discount}")

            order_items.append({
                'product_id': deal_product.id,
                'sku': deal_product.sku,
                'quantity': 1,
                'selling_price': sale_price,
                'mrp': deal_product.mrp,
                'discount': discount,
                'total': total,
                'deal_of_week': deal_id
            })

            total_price += total
            total_discount += discount

            # Add to shipping items
            shipping_items.append({"product": deal_product, "qty": 1})

        # Calculate shipping for deal items
        shipping_info = calculate_cart_shipping(shipping_items)

    # 🆔 Generate Order ID & Fetch Customer
    order_id = generate_bmo_id()
    print("🆔 Generated order ID:", order_id)

    customer = User.objects.filter(id=request.user.id).first()
    if not customer:
        print("❌ Customer not found")
        return Response(data={'message': 'Customer not found.'}, status=status.HTTP_400_BAD_REQUEST)

    # ✨✨✨ UPDATED: Check Coupon Application - NOW SUPPORTS SHOP THE LOOK ✨✨✨
    # Changed from: if not is_combo_purchase:
    # To allow coupons for Shop The Look orders
    coupon_discount = Decimal('0')
    applied_coupon = None
    coupon_code = request.data.get('coupon_code')
    
    if coupon_code:
        coupon = Coupon.objects.filter(code=coupon_code, is_active=True).first()
        if coupon:
            # Check minimum order value
            if total_price >= Decimal(str(coupon.minimum_order_value)):
                if coupon.discount_type == 'FLAT':
                    discount_amount = min(total_price, Decimal(str(coupon.discount_value)))
                elif coupon.discount_type == 'PERCENTAGE':
                    discount_amount = (Decimal(str(coupon.discount_value)) / Decimal('100')) * total_price
                    if coupon.max_discount_value:
                        discount_amount = min(discount_amount, Decimal(str(coupon.max_discount_value)))
                coupon_discount = discount_amount
                applied_coupon = coupon
            else:
                return Response(data={'message': 'Invalid or ineligible coupon.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(data={'message': 'Invalid or ineligible coupon.'}, status=status.HTTP_400_BAD_REQUEST)

    # ✨✨✨ UPDATED: Extract shipping_charge from the dictionary ✨✨✨
    # Ensure shipping_info exists before trying to get the value
    shipping_charge = Decimal('0')
    if shipping_info:
        shipping_charge = Decimal(str(shipping_info.get('shipping_charge', 0)))

    # ✨✨✨ UPDATED: Calculate grand_total with coupon_discount ✨✨✨
    # Changed from: grand_total = total_price - total_discount + shipping_charge
    # To include coupon discount in the calculation
    grand_total = total_price - total_discount - coupon_discount + shipping_charge

    # 📝 Create and Save Order
    order_data = {
        "order_id": order_id,
        "date": time.strftime("%Y-%m-%d"),
        "customer_id": customer.id,
        "customer_name": customer.first_name,
        "email": customer.email,
        "mobile": customer.mobile,
        "has_gst": customer.has_gst,
        "total_price": total_price,
        "total_discount": total_discount,
        "coupon_applied": bool(coupon_discount > 0),
        "applied_coupon": applied_coupon.id if applied_coupon else None,
        "coupon_discount": coupon_discount,
        "shipping_charge": shipping_charge,
        "grand_total": grand_total,
        "is_combo_purchase": is_combo_purchase,
        "is_shop_the_look": is_shop_the_look
    }

    print("📋 Order Data:", order_data)

    order_serializer = PlaceOrderSerializer(data=order_data)
    if order_serializer.is_valid():
        order_instance = order_serializer.save()
        print("✅ Order created successfully")
    else:
        print("❌ Order serialization error:", order_serializer.errors)
        return Response(data={'message': 'Error', 'errors': order_serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST)

    # 📦 Save Order Items
    order_item_instances = []
    print("Order instance ID:", order_instance.id)

    for item in order_items:
        # Assign the order_instance.id to order_id
        item['order_id'] = order_instance.id  # ✅ Correctly assign the order ID
        order_item_serializer = OrderItemSerializer(data=item)

        if order_item_serializer.is_valid():
            order_item_instance = order_item_serializer.save()
            order_item_instances.append(order_item_instance)  # Add the saved instance to the list
        else:
            print("❌ Order item error:", order_item_serializer.errors)
            return Response(data={'message': 'Error', 'errors': order_item_serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)

    print("✅ Order items created successfully")

    order_items_serializer = OrderItemSerializer(order_item_instances, many=True)

    return Response(data={
        'message': 'success',
        'data': {
            'order': order_serializer.data,
            'order_items': order_items_serializer.data,
            'shipping_info': shipping_info  # Include shipping info in response
        }
    }, status=status.HTTP_200_OK)


# The calculate_cart_shipping function remains the same as it is correct.
def calculate_cart_shipping(cart_items):
    """
    cart_items = [
        {"product": product_obj, "qty": 2},
        {"product": product_obj2, "qty": 1},
    ]
    """

    # ------------ 1️⃣ Fetch Config From DB ------------
    try:
        config = ShippingConfig.objects.filter(is_active=True).first()
        free_shipping_min_amount = config.free_shipping_amount if config else 0
    except Exception as e:
        print(e, '==========shipping')
        free_shipping_min_amount = 0

    # ------------ 2️⃣ Calculate weights & amount ------------
    total_amount = 0
    total_actual_weight = 0
    total_volumetric_weight = 0

    for item in cart_items:
        product = item["product"]
        qty = item["qty"]

        dim = product.product_dimension_weight or {}

        length = float(dim.get("length", 0) or 0)
        width = float(dim.get("width", 0) or 0)
        height = float(dim.get("height", 0) or 0)

        raw_weight = dim.get("weight", 0)
        if isinstance(raw_weight, dict):
            actual_g = raw_weight.get("value", 0)
        else:
            actual_g = raw_weight

        try:
            actual_g = float(actual_g)
        except (TypeError, ValueError):
            actual_g = 0

        actual_kg = actual_g / 1000
        volumetric_kg = (length * width * height) / 5000

        total_actual_weight += actual_kg * qty
        total_volumetric_weight += volumetric_kg * qty
        total_amount += float(product.selling_price) * qty

    # ------------ 3️⃣ Chargeable weight logic ------------
    chargeable_weight = max(total_actual_weight, total_volumetric_weight)

    # ------------ 4️⃣ Free Shipping Condition ------------
    if free_shipping_min_amount > 0 and total_amount >= free_shipping_min_amount:
        return {
            "total_amount": total_amount,
            "total_actual_weight": round(total_actual_weight, 2),
            "total_volumetric_weight": round(total_volumetric_weight, 2),
            "chargeable_weight": round(chargeable_weight, 2),
            "shipping_charge": 0,
            "free_shipping": True,
        }

    # ------------ 5️⃣ Get charge from ShippingCharge table ------------
    rate = ShippingCharge.objects.filter(
        is_active=True,
        min_weight__lte=chargeable_weight,
        max_weight__gte=chargeable_weight
    ).order_by("order").first()

    shipping_charge = rate.charge if rate else 0

    return {
        "total_amount": total_amount,
        "total_actual_weight": round(total_actual_weight, 2),
        "total_volumetric_weight": round(total_volumetric_weight, 2),
        "chargeable_weight": round(chargeable_weight, 2),
        "shipping_charge": shipping_charge,
        "free_shipping": False,
    }
