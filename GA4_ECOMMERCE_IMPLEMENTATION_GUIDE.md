# GA4 Ecommerce Tracking Implementation Guide

## Overview
This guide explains how to implement Google Analytics 4 Enhanced Ecommerce tracking across the Gidan Store application.

## Setup
GA4 is already configured with tracking ID: `G-3QW5M8DK5G`

## Utility Functions
All GA4 ecommerce tracking functions are available in `src/utils/ga4Ecommerce.js`

## Required Events

### 1. view_item (Product Detail Page)
**When:** User views a product detail page  
**Where:** `ProductData.jsx`

```javascript
import { trackViewItem } from '../../utils/ga4Ecommerce';

useEffect(() => {
    if (productDetailData?.data?.product) {
        trackViewItem(productDetailData.data.product);
    }
}, [productDetailData]);
```

### 2. view_item_list (Product Listing Pages)
**When:** User sees a list of products  
**Where:** `PlantFilter.jsx`, `Home.jsx`, Category pages

```javascript
import { trackViewItemList } from '../../utils/ga4Ecommerce';

useEffect(() => {
    if (products && products.length > 0) {
        trackViewItemList(products, 'Category: Plants');
    }
}, [products]);
```

### 3. select_item (Product Click in List)
**When:** User clicks on a product in a list  
**Where:** Product cards, `TrendingSection.jsx`

```javascript
import { trackSelectItem } from '../../utils/ga4Ecommerce';

const handleProductClick = (product, index) => {
    trackSelectItem(product, 'Trending Products', index);
    navigate(`/${categorySlug}/${subcategorySlug}/${productSlug}/`);
};
```

### 4. add_to_cart ✅ ALREADY IMPLEMENTED
**When:** User adds a product to cart  
**Where:** `ProductData.jsx` (lines 214-230, 237-253)

**Current Implementation:**
```javascript
window.dataLayer.push({
    event: "add_to_cart",
    ecommerce: {
        currency: "NGN",  // Should be "INR"
        value: productDetailData?.data?.product?.selling_price,
        items: [{
            item_name: productDetailData?.data?.product?.main_product_name,
            item_id: productDetailData?.data?.product?.id,
            price: productDetailData?.data?.product?.selling_price,
            quantity: quantity
        }]
    }
});
```

**Recommended Update:**
```javascript
import { trackAddToCart } from '../../utils/ga4Ecommerce';

// Replace existing dataLayer.push with:
trackAddToCart(productDetailData.data.product, quantity);
```

### 5. remove_from_cart
**When:** User removes a product from cart  
**Where:** `Cart.jsx`

```javascript
import { trackRemoveFromCart } from '../../utils/ga4Ecommerce';

const handleRemoveFromCart = async (product) => {
    trackRemoveFromCart(product, product.quantity);
    // ... existing remove logic
};
```

### 6. view_cart
**When:** User views their cart  
**Where:** `Cart.jsx`

```javascript
import { trackViewCart } from '../../utils/ga4Ecommerce';

useEffect(() => {
    if (cartItems && cartItems.length > 0) {
        trackViewCart(cartItems);
    }
}, [cartItems]);
```

### 7. begin_checkout
**When:** User clicks "Proceed to Checkout" or lands on checkout page  
**Where:** `Cart.jsx` (button click) or `CheckoutPage.jsx` (page load)

```javascript
import { trackBeginCheckout } from '../../utils/ga4Ecommerce';

const handleProceedToCheckout = () => {
    trackBeginCheckout(cartItems, totalValue);
    navigate('/checkout');
};

// OR in CheckoutPage.jsx:
useEffect(() => {
    if (orderSummary?.items) {
        trackBeginCheckout(orderSummary.items, orderSummary.total);
    }
}, [orderSummary]);
```

### 8. add_shipping_info
**When:** User selects/confirms shipping method  
**Where:** `CheckoutPage.jsx`

```javascript
import { trackAddShippingInfo } from '../../utils/ga4Ecommerce';

const handleShippingSelection = (shippingMethod) => {
    trackAddShippingInfo(cartItems, shippingMethod, totalValue);
    // ... existing logic
};
```

### 9. add_payment_info
**When:** User selects payment method  
**Where:** `CheckoutPage.jsx` or `PaymentGateway.jsx`

```javascript
import { trackAddPaymentInfo } from '../../utils/ga4Ecommerce';

const handlePaymentSelection = (paymentMethod) => {
    trackAddPaymentInfo(cartItems, paymentMethod, totalValue);
    // ... existing logic
};
```

### 10. purchase
**When:** Order is successfully completed  
**Where:** `Successpage.jsx` or order confirmation page

```javascript
import { trackPurchase } from '../../utils/ga4Ecommerce';

useEffect(() => {
    if (orderData) {
        trackPurchase({
            transaction_id: orderData.order_id,
            value: orderData.total_amount,
            tax: orderData.tax,
            shipping: orderData.shipping_cost,
            coupon: orderData.coupon_code,
            items: orderData.items
        });
    }
}, [orderData]);
```

## Additional Events

### add_to_wishlist
**When:** User adds a product to wishlist  
**Where:** Product cards, `ProductData.jsx`

```javascript
import { trackAddToWishlist } from '../../utils/ga4Ecommerce';

const handleAddToWishlist = (product) => {
    trackAddToWishlist(product);
    // ... existing wishlist logic
};
```

### search
**When:** User performs a search  
**Where:** Search component

```javascript
import { trackSearch } from '../../utils/ga4Ecommerce';

const handleSearch = (searchTerm) => {
    trackSearch(searchTerm);
    // ... existing search logic
};
```

## Implementation Priority

### Phase 1: Critical Events (Immediate)
1. ✅ add_to_cart (already implemented, needs currency fix)
2. view_item (product detail pages)
3. begin_checkout (checkout initiation)
4. purchase (order completion)

### Phase 2: Important Events (Next)
5. view_cart (cart page)
6. remove_from_cart (cart management)
7. add_payment_info (payment selection)

### Phase 3: Enhanced Tracking (Later)
8. view_item_list (product listings)
9. select_item (product clicks)
10. add_shipping_info (shipping selection)
11. add_to_wishlist (wishlist actions)
12. search (search tracking)

## Testing

### 1. Enable GA4 Debug Mode
Add to URL: `?debug_mode=true`

### 2. Use Google Tag Assistant
Install: [Tag Assistant Chrome Extension](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)

### 3. Check Real-time Reports
GA4 Dashboard → Reports → Realtime

### 4. Verify Events in Console
All tracking functions log to console:
```
GA4: add_to_cart tracked { product: "Peace Lily Plant", quantity: 1 }
```

## Common Issues

### Issue 1: Currency Mismatch
**Problem:** Current implementation uses "NGN" (Nigerian Naira)  
**Solution:** Update to "INR" (Indian Rupee) in all tracking calls

### Issue 2: Missing Product Data
**Problem:** Product object doesn't have required fields  
**Solution:** Ensure product object includes:
- `id` or `product_id`
- `name` or `main_product_name`
- `selling_price` or `price`
- `category_slug` (optional but recommended)
- `sub_category_slug` (optional but recommended)

### Issue 3: Duplicate Events
**Problem:** Same event fires multiple times  
**Solution:** Use `useEffect` dependencies carefully, track only on specific actions

### Issue 4: Events Not Showing in GA4
**Problem:** Events tracked but not visible in GA4  
**Solution:** 
- Check GA4 property ID is correct (G-3QW5M8DK5G)
- Wait 24-48 hours for data processing
- Use DebugView for immediate verification

## Data Layer Structure

All events follow this structure:
```javascript
window.dataLayer.push({
    event: 'event_name',
    ecommerce: {
        currency: 'INR',
        value: 1299.00,
        items: [{
            item_id: '123',
            item_name: 'Peace Lily Plant',
            item_category: 'plants',
            item_category2: 'indoor-plants',
            price: 1299.00,
            quantity: 1
        }]
    }
});
```

## Best Practices

1. **Clear Previous Ecommerce Object**
   ```javascript
   window.dataLayer.push({ ecommerce: null });
   ```

2. **Use Consistent Currency**
   Always use "INR" for Indian Rupees

3. **Include All Available Data**
   More data = better insights (categories, variants, etc.)

4. **Track User Journey**
   Implement events in logical order: view → add_to_cart → checkout → purchase

5. **Test Thoroughly**
   Verify each event in GA4 DebugView before deploying

## Files to Update

### High Priority:
1. `src/views/utilities/ProductData/ProductData.jsx` - view_item, update add_to_cart
2. `src/views/utilities/CheckoutPage/CheckoutPage.jsx` - begin_checkout, add_payment_info
3. `src/views/utilities/PaymentGateway/Successpage.jsx` - purchase
4. `src/views/CartProducts/Cart/Cart.jsx` - view_cart, remove_from_cart

### Medium Priority:
5. `src/views/utilities/PlantFilter/PlantFilter.jsx` - view_item_list
6. `src/Components/TrendingProducts/TrendingSection.jsx` - select_item
7. `src/views/utilities/WishList/WishList.jsx` - add_to_wishlist

## Verification Checklist

- [ ] view_item fires on product detail page load
- [ ] add_to_cart fires when adding to cart (currency = INR)
- [ ] remove_from_cart fires when removing from cart
- [ ] view_cart fires on cart page load
- [ ] begin_checkout fires when starting checkout
- [ ] add_payment_info fires when selecting payment
- [ ] purchase fires on order success page
- [ ] All events include correct product data
- [ ] All events use INR currency
- [ ] Events visible in GA4 DebugView
- [ ] Events appear in GA4 Realtime reports

## Support

For GA4 documentation:
- [GA4 Ecommerce Events](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [GA4 DebugView](https://support.google.com/analytics/answer/7201382)

For implementation questions, refer to `src/utils/ga4Ecommerce.js` for function signatures and examples.
