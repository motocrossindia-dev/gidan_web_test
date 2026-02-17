# Shop The Look - Order Flow Documentation

## Overview
Shop The Look supports two purchase flows:
1. **Add to Cart** → Go to Cart → Place Order (order_source: "cart")
2. **Place Order** directly (order_source: "combo")

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Shop The Look Popup                       │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Product 1: Capri Hanging Pot    ₹803  ₹645       │    │
│  │  Product 2: Tokyo Bowl Planter   ₹1433 ₹1500      │    │
│  │  Product 3: Siena Eco Planter    ₹600             │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │  Add to Cart     │  │  Place Order     │               │
│  └──────────────────┘  └──────────────────┘               │
└─────────────────────────────────────────────────────────────┘
         │                        │
         │                        │
         ▼                        ▼
```

## Flow 1: Add to Cart → Place Order from Cart

### Step 1: Add to Cart
```javascript
// Frontend Request
POST /order/cart/
{
  "product_ids": [123, 456, 789]  // All Shop The Look products
}

// Backend Response
{
  "message": "Bulk add to cart completed",
  "added_count": 3,
  "already_in_cart_count": 0,
  "error_count": 0
}
```

### Step 2: Navigate to Cart Page
```javascript
navigate("/cart");
```

### Step 3: User Reviews Cart & Clicks "Place Order"
```javascript
// Frontend Request (from Cart page)
POST /order/placeOrder/
{
  "order_source": "cart"  // ← Uses cart as source
}

// Backend Process
1. Gets all items from user's cart
2. Validates stock for each item
3. Calculates total, discount, shipping
4. Creates order with all cart items
5. Clears the cart
```

## Flow 2: Direct Place Order (Buy Now)

### Step 1: Click "Place Order" in Popup
```javascript
// Frontend Request
POST /order/placeOrder/
{
  "order_source": "combo",  // ← Uses combo as source
  "combo_id": 5             // Shop The Look combo ID
}

// Backend Process
1. Gets combo offer by ID
2. Checks if is_shop_the_look = True
3. Gets all products in the combo
4. Calculates combo price & discount
5. Creates order with combo items
6. Does NOT touch the cart
```

### Step 2: Navigate to Checkout
```javascript
navigate("/checkout", {
  state: { ordersummary: response.data.data }
});
```

## Backend Implementation

### File: `biotechmaali main server/order/view/shop_the_look.py`

```python
@api_view(['POST'])
def placeOrder(request):
    order_source = request.data.get('order_source')
    
    # Validate order source
    if order_source not in ['product', 'cart', 'combo', 'deal']:
        return Response({'message': 'Invalid order source.'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    # Flow 1: Cart Order
    if order_source == 'cart':
        cart_items = Cart.objects.filter(user_id=request.user.id).all()
        # Process cart items...
        # Clear cart after order
        Cart.objects.filter(user_id=request.user.id).delete()
    
    # Flow 2: Combo Order (Shop The Look)
    elif order_source == 'combo':
        combo_id = request.data.get('combo_id')
        combo = ComboOffer.objects.filter(id=combo_id).first()
        
        # Check if it's Shop The Look
        is_shop_the_look = combo.is_shop_the_look
        is_combo_purchase = True
        
        # Process combo products...
        # Cart is NOT affected
```

## Frontend Implementation

### File: `git 3/biotech_ecomerce/src/Components/ShopTheLook/ShopTheLook.jsx`

```javascript
// Add to Cart Handler
const handleAddToCart = async () => {
  const productIds = productss.map(product => product.id);
  
  // Bulk add to cart
  const response = await axiosInstance.post('/order/cart/', {
    product_ids: productIds
  });
  
  // Navigate to cart
  navigate("/cart");
};

// Place Order Handler
const handleBuyItNowSubmit = async () => {
  // Direct order with combo
  const response = await axiosInstance.post('/order/placeOrder/', {
    order_source: "combo",
    combo_id: shopid
  });
  
  // Navigate to checkout
  navigate("/checkout", {
    state: { ordersummary: response.data.data }
  });
};
```

## Key Differences

| Aspect | Add to Cart Flow | Direct Place Order |
|--------|------------------|-------------------|
| **Order Source** | `"cart"` | `"combo"` |
| **Cart Affected** | ✅ Yes, products added | ❌ No, cart untouched |
| **User Can Review** | ✅ Yes, in cart page | ❌ No, goes directly to checkout |
| **User Can Modify** | ✅ Yes, can change quantities | ❌ No, fixed combo |
| **Discount Applied** | Individual product discounts | Combo-level discount |
| **Navigation** | Cart → Checkout | Popup → Checkout |

## Database Models

### ComboOffer Model
```python
class ComboOffer(models.Model):
    name = models.CharField(max_length=255)
    products = models.ManyToManyField(Product)
    final_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2)
    is_shop_the_look = models.BooleanField(default=False)  # ← Identifies Shop The Look
    is_published = models.BooleanField(default=True)
```

### Cart Model
```python
class Cart(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
```

## API Endpoints Summary

### 1. Add Products to Cart (Bulk)
```
POST /order/cart/
Body: { "product_ids": [123, 456, 789] }
Response: { "added_count": 3, "already_in_cart_count": 0 }
```

### 2. Place Order from Cart
```
POST /order/placeOrder/
Body: { "order_source": "cart" }
Response: { "data": { order_details } }
```

### 3. Place Order Directly (Combo)
```
POST /order/placeOrder/
Body: { "order_source": "combo", "combo_id": 5 }
Response: { "data": { order_details } }
```

## User Experience

### Scenario 1: User Wants to Review Before Buying
1. Click "Add to Cart" in Shop The Look popup
2. Popup closes, navigates to cart page
3. User sees all products in cart
4. User can modify quantities, remove items
5. User clicks "Place Order" in cart
6. Goes to checkout

### Scenario 2: User Wants Quick Purchase
1. Click "Place Order" in Shop The Look popup
2. Popup closes, goes directly to checkout
3. Order is created with combo pricing
4. User completes payment
5. Cart remains unchanged

## Benefits of This Approach

### Add to Cart Flow
- ✅ User can review products
- ✅ User can modify quantities
- ✅ User can add more products
- ✅ User can apply coupons
- ✅ Flexible shopping experience

### Direct Place Order Flow
- ✅ Faster checkout
- ✅ Combo pricing preserved
- ✅ No cart clutter
- ✅ One-click purchase
- ✅ Better for impulse buying

## Testing Checklist

### Test Add to Cart Flow
- [ ] Click "Add to Cart" in Shop The Look popup
- [ ] Verify all products added to cart
- [ ] Navigate to cart page
- [ ] Verify products visible in cart
- [ ] Modify quantity of one product
- [ ] Click "Place Order" in cart
- [ ] Verify order created with `order_source: "cart"`
- [ ] Verify cart is cleared after order

### Test Direct Place Order Flow
- [ ] Click "Place Order" in Shop The Look popup
- [ ] Verify navigates to checkout
- [ ] Verify order created with `order_source: "combo"`
- [ ] Verify cart is NOT affected
- [ ] Complete payment
- [ ] Verify order success

### Test Edge Cases
- [ ] Add to cart when some products already in cart
- [ ] Place order when out of stock
- [ ] Place order without authentication
- [ ] Add to cart with invalid product IDs

## Conclusion

The Shop The Look feature now supports both shopping flows:
1. **Thoughtful Shopping**: Add to cart → Review → Place order
2. **Quick Purchase**: Direct place order with combo pricing

Both flows are fully implemented and working correctly! ✅
