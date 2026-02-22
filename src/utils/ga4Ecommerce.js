'use client';

/**
 * GA4 Ecommerce Tracking Utilities for Gidan Store
 * 
 * Implements Google Analytics 4 Enhanced Ecommerce tracking
 * Following GA4 ecommerce events specification:
 * https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */

/**
 * Initialize dataLayer if it doesn't exist
 */
const initDataLayer = () => {
    window.dataLayer = window.dataLayer || [];
};

/**
 * Format product item for GA4
 * 
 * @param {object} product - Product object
 * @param {number} quantity - Quantity (default: 1)
 * @param {number} index - Item position in list (optional)
 * @returns {object} - Formatted GA4 item
 */
const formatGA4Item = (product, quantity = 1, index = null) => {
    const item = {
        item_id: product.id || product.product_id || '',
        item_name: product.name || product.main_product_name || '',
        price: parseFloat(product.selling_price || product.price || 0),
        quantity: parseInt(quantity) || 1,
    };

    // Optional fields
    if (product.category_slug || product.category) {
        item.item_category = product.category_slug || product.category;
    }

    if (product.sub_category_slug || product.subcategory) {
        item.item_category2 = product.sub_category_slug || product.subcategory;
    }

    if (product.sku) {
        item.item_variant = product.sku;
    }

    if (product.mrp) {
        item.discount = parseFloat(product.mrp - product.selling_price);
    }

    if (index !== null) {
        item.index = index;
    }

    return item;
};

/**
 * Calculate total value from items
 * 
 * @param {array} items - Array of GA4 formatted items
 * @returns {number} - Total value
 */
const calculateValue = (items) => {
    return items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
};

/**
 * Track view_item event
 * Fired when a user views a product detail page
 * 
 * @param {object} product - Product object
 */
export const trackViewItem = (product) => {
    if (!product) return;

    initDataLayer();

    const item = formatGA4Item(product);

    window.dataLayer.push({ ecommerce: null }); // Clear previous ecommerce object
    window.dataLayer.push({
        event: 'view_item',
        ecommerce: {
            currency: 'INR',
            value: item.price,
            items: [item]
        }
    });

    console.log('GA4: view_item tracked', { product: product.name });
};

/**
 * Track view_item_list event
 * Fired when a user sees a list of products
 * 
 * @param {array} products - Array of product objects
 * @param {string} listName - Name of the list (e.g., "Search Results", "Category: Plants")
 */
export const trackViewItemList = (products, listName = 'Product List') => {
    if (!products || products.length === 0) return;

    initDataLayer();

    const items = products.map((product, index) => formatGA4Item(product, 1, index));

    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
        event: 'view_item_list',
        ecommerce: {
            currency: 'INR',
            item_list_name: listName,
            items: items.slice(0, 10) // GA4 recommends max 10 items
        }
    });

    console.log('GA4: view_item_list tracked', { listName, count: items.length });
};

/**
 * Track select_item event
 * Fired when a user clicks on a product in a list
 * 
 * @param {object} product - Product object
 * @param {string} listName - Name of the list
 * @param {number} index - Position in the list
 */
export const trackSelectItem = (product, listName = 'Product List', index = 0) => {
    if (!product) return;

    initDataLayer();

    const item = formatGA4Item(product, 1, index);

    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
        event: 'select_item',
        ecommerce: {
            currency: 'INR',
            item_list_name: listName,
            items: [item]
        }
    });

    console.log('GA4: select_item tracked', { product: product.name, listName });
};

/**
 * Track add_to_cart event
 * Fired when a user adds a product to cart
 * 
 * @param {object} product - Product object
 * @param {number} quantity - Quantity added
 */
export const trackAddToCart = (product, quantity = 1) => {
    if (!product) return;

    initDataLayer();

    const item = formatGA4Item(product, quantity);

    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
        event: 'add_to_cart',
        ecommerce: {
            currency: 'INR',
            value: item.price * item.quantity,
            items: [item]
        }
    });

    console.log('GA4: add_to_cart tracked', { product: product.name, quantity });
};

/**
 * Track remove_from_cart event
 * Fired when a user removes a product from cart
 * 
 * @param {object} product - Product object
 * @param {number} quantity - Quantity removed
 */
export const trackRemoveFromCart = (product, quantity = 1) => {
    if (!product) return;

    initDataLayer();

    const item = formatGA4Item(product, quantity);

    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
        event: 'remove_from_cart',
        ecommerce: {
            currency: 'INR',
            value: item.price * item.quantity,
            items: [item]
        }
    });

    console.log('GA4: remove_from_cart tracked', { product: product.name, quantity });
};

/**
 * Track view_cart event
 * Fired when a user views their cart
 * 
 * @param {array} cartItems - Array of cart items
 */
export const trackViewCart = (cartItems) => {
    if (!cartItems || cartItems.length === 0) return;

    initDataLayer();

    const items = cartItems.map(item => formatGA4Item(item.product || item, item.quantity || 1));
    const value = calculateValue(items);

    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
        event: 'view_cart',
        ecommerce: {
            currency: 'INR',
            value: value,
            items: items
        }
    });

    console.log('GA4: view_cart tracked', { itemCount: items.length, value });
};

/**
 * Track begin_checkout event
 * Fired when a user begins the checkout process
 * 
 * @param {array} cartItems - Array of cart items
 * @param {number} totalValue - Total cart value (optional, will be calculated if not provided)
 */
export const trackBeginCheckout = (cartItems, totalValue = null) => {
    if (!cartItems || cartItems.length === 0) return;

    initDataLayer();

    const items = cartItems.map(item => formatGA4Item(item.product || item, item.quantity || 1));
    const value = totalValue || calculateValue(items);

    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
        event: 'begin_checkout',
        ecommerce: {
            currency: 'INR',
            value: value,
            items: items
        }
    });

    console.log('GA4: begin_checkout tracked', { itemCount: items.length, value });
};

/**
 * Track add_shipping_info event
 * Fired when a user submits shipping information
 * 
 * @param {array} cartItems - Array of cart items
 * @param {string} shippingTier - Shipping method (e.g., "Standard", "Express")
 * @param {number} totalValue - Total value
 */
export const trackAddShippingInfo = (cartItems, shippingTier = 'Standard', totalValue = null) => {
    if (!cartItems || cartItems.length === 0) return;

    initDataLayer();

    const items = cartItems.map(item => formatGA4Item(item.product || item, item.quantity || 1));
    const value = totalValue || calculateValue(items);

    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
        event: 'add_shipping_info',
        ecommerce: {
            currency: 'INR',
            value: value,
            shipping_tier: shippingTier,
            items: items
        }
    });

    console.log('GA4: add_shipping_info tracked', { shippingTier, value });
};

/**
 * Track add_payment_info event
 * Fired when a user submits payment information
 * 
 * @param {array} cartItems - Array of cart items
 * @param {string} paymentType - Payment method (e.g., "Credit Card", "UPI", "COD")
 * @param {number} totalValue - Total value
 */
export const trackAddPaymentInfo = (cartItems, paymentType = 'Unknown', totalValue = null) => {
    if (!cartItems || cartItems.length === 0) return;

    initDataLayer();

    const items = cartItems.map(item => formatGA4Item(item.product || item, item.quantity || 1));
    const value = totalValue || calculateValue(items);

    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
        event: 'add_payment_info',
        ecommerce: {
            currency: 'INR',
            value: value,
            payment_type: paymentType,
            items: items
        }
    });

    console.log('GA4: add_payment_info tracked', { paymentType, value });
};

/**
 * Track purchase event
 * Fired when a user completes a purchase
 * 
 * @param {object} orderData - Order data object
 * @param {string} orderData.transaction_id - Unique order ID
 * @param {number} orderData.value - Total order value
 * @param {number} orderData.tax - Tax amount (optional)
 * @param {number} orderData.shipping - Shipping cost (optional)
 * @param {string} orderData.coupon - Coupon code used (optional)
 * @param {array} orderData.items - Array of order items
 */
export const trackPurchase = (orderData) => {
    if (!orderData || !orderData.transaction_id || !orderData.items) {
        console.error('GA4: Invalid purchase data', orderData);
        return;
    }

    initDataLayer();

    const items = orderData.items.map(item => 
        formatGA4Item(item.product || item, item.quantity || 1)
    );

    const purchaseEvent = {
        event: 'purchase',
        ecommerce: {
            currency: 'INR',
            transaction_id: orderData.transaction_id,
            value: parseFloat(orderData.value || calculateValue(items)),
            items: items
        }
    };

    // Optional fields
    if (orderData.tax) {
        purchaseEvent.ecommerce.tax = parseFloat(orderData.tax);
    }

    if (orderData.shipping) {
        purchaseEvent.ecommerce.shipping = parseFloat(orderData.shipping);
    }

    if (orderData.coupon) {
        purchaseEvent.ecommerce.coupon = orderData.coupon;
    }

    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push(purchaseEvent);

    console.log('GA4: purchase tracked', { 
        transaction_id: orderData.transaction_id, 
        value: purchaseEvent.ecommerce.value 
    });
};

/**
 * Track refund event
 * Fired when a purchase is refunded
 * 
 * @param {string} transactionId - Original transaction ID
 * @param {number} value - Refund amount (optional, full refund if not provided)
 * @param {array} items - Items being refunded (optional, all items if not provided)
 */
export const trackRefund = (transactionId, value = null, items = null) => {
    if (!transactionId) return;

    initDataLayer();

    const refundEvent = {
        event: 'refund',
        ecommerce: {
            currency: 'INR',
            transaction_id: transactionId
        }
    };

    if (value) {
        refundEvent.ecommerce.value = parseFloat(value);
    }

    if (items) {
        refundEvent.ecommerce.items = items.map(item => 
            formatGA4Item(item.product || item, item.quantity || 1)
        );
    }

    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push(refundEvent);

    console.log('GA4: refund tracked', { transaction_id: transactionId });
};

/**
 * Track add_to_wishlist event
 * Fired when a user adds a product to wishlist
 * 
 * @param {object} product - Product object
 */
export const trackAddToWishlist = (product) => {
    if (!product) return;

    initDataLayer();

    const item = formatGA4Item(product);

    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
        event: 'add_to_wishlist',
        ecommerce: {
            currency: 'INR',
            value: item.price,
            items: [item]
        }
    });

    console.log('GA4: add_to_wishlist tracked', { product: product.name });
};

/**
 * Track search event
 * Fired when a user performs a search
 * 
 * @param {string} searchTerm - Search query
 */
export const trackSearch = (searchTerm) => {
    if (!searchTerm) return;

    initDataLayer();

    window.dataLayer.push({
        event: 'search',
        search_term: searchTerm
    });

    console.log('GA4: search tracked', { searchTerm });
};

/**
 * Track custom event
 * For any custom tracking needs
 * 
 * @param {string} eventName - Event name
 * @param {object} eventParams - Event parameters
 */
export const trackCustomEvent = (eventName, eventParams = {}) => {
    if (!eventName) return;

    initDataLayer();

    window.dataLayer.push({
        event: eventName,
        ...eventParams
    });

    console.log('GA4: custom event tracked', { eventName, eventParams });
};

export default {
    trackViewItem,
    trackViewItemList,
    trackSelectItem,
    trackAddToCart,
    trackRemoveFromCart,
    trackViewCart,
    trackBeginCheckout,
    trackAddShippingInfo,
    trackAddPaymentInfo,
    trackPurchase,
    trackRefund,
    trackAddToWishlist,
    trackSearch,
    trackCustomEvent
};
