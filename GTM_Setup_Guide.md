# GTM Setup Guide — Gidan Store GA4 Events

**Measurement ID**: `G-T4GR7HMTN6`  
**Already done**: `view_item` ✅, `view_item_list` ✅

---

## How to create each tag (repeat this process for every row below)

1. **Tags → New** → Tag Type: **Google Analytics: GA4 Event**
2. **Measurement ID**: `G-T4GR7HMTN6`
3. **Event Name**: _(see table)_
4. **More Settings → Ecommerce** → ✅ **Send Ecommerce data** → **Data Layer** _(except search)_
5. **Triggering** → click area → **"+"** → **Custom Event**
   - Event name: _(same as event name)_
   - Fires on: **All Custom Events**
   - Trigger name: `CE - <event_name>`
   - Save trigger
6. Name the tag `GA4 - <event_name>` → **Save**

---

## Remaining Tags to Create

### 3. GA4 - select_item
| Field | Value |
|---|---|
| Event Name | `select_item` |
| Ecommerce | ✅ Data Layer |
| Trigger Type | Custom Event |
| Trigger Event Name | `select_item` |
| Trigger Name | `CE - select_item` |
| Tag Name | `GA4 - select_item` |

---

### 4. GA4 - add_to_cart
| Field | Value |
|---|---|
| Event Name | `add_to_cart` |
| Ecommerce | ✅ Data Layer |
| Trigger Type | Custom Event |
| Trigger Event Name | `add_to_cart` |
| Trigger Name | `CE - add_to_cart` |
| Tag Name | `GA4 - add_to_cart` |

---

### 5. GA4 - remove_from_cart
| Field | Value |
|---|---|
| Event Name | `remove_from_cart` |
| Ecommerce | ✅ Data Layer |
| Trigger Type | Custom Event |
| Trigger Event Name | `remove_from_cart` |
| Trigger Name | `CE - remove_from_cart` |
| Tag Name | `GA4 - remove_from_cart` |

---

### 6. GA4 - view_cart
| Field | Value |
|---|---|
| Event Name | `view_cart` |
| Ecommerce | ✅ Data Layer |
| Trigger Type | Custom Event |
| Trigger Event Name | `view_cart` |
| Trigger Name | `CE - view_cart` |
| Tag Name | `GA4 - view_cart` |

---

### 7. GA4 - add_to_wishlist
| Field | Value |
|---|---|
| Event Name | `add_to_wishlist` |
| Ecommerce | ✅ Data Layer |
| Trigger Type | Custom Event |
| Trigger Event Name | `add_to_wishlist` |
| Trigger Name | `CE - add_to_wishlist` |
| Tag Name | `GA4 - add_to_wishlist` |

---

### 8. GA4 - begin_checkout
| Field | Value |
|---|---|
| Event Name | `begin_checkout` |
| Ecommerce | ✅ Data Layer |
| Trigger Type | Custom Event |
| Trigger Event Name | `begin_checkout` |
| Trigger Name | `CE - begin_checkout` |
| Tag Name | `GA4 - begin_checkout` |

---

### 9. GA4 - add_shipping_info
| Field | Value |
|---|---|
| Event Name | `add_shipping_info` |
| Ecommerce | ✅ Data Layer |
| Trigger Type | Custom Event |
| Trigger Event Name | `add_shipping_info` |
| Trigger Name | `CE - add_shipping_info` |
| Tag Name | `GA4 - add_shipping_info` |

---

### 10. GA4 - add_payment_info
| Field | Value |
|---|---|
| Event Name | `add_payment_info` |
| Ecommerce | ✅ Data Layer |
| Trigger Type | Custom Event |
| Trigger Event Name | `add_payment_info` |
| Trigger Name | `CE - add_payment_info` |
| Tag Name | `GA4 - add_payment_info` |

---

### 11. GA4 - purchase
| Field | Value |
|---|---|
| Event Name | `purchase` |
| Ecommerce | ✅ Data Layer |
| Trigger Type | Custom Event |
| Trigger Event Name | `purchase` |
| Trigger Name | `CE - purchase` |
| Tag Name | `GA4 - purchase` |

---

### 12. GA4 - search ⚠️ (different — no ecommerce, has parameter)
| Field | Value |
|---|---|
| Event Name | `search` |
| Ecommerce | ❌ Do NOT enable |
| Event Parameter | Name: `search_term` / Value: `{{DLV - search_term}}` |
| Trigger Type | Custom Event |
| Trigger Event Name | `search` |
| Trigger Name | `CE - search` |
| Tag Name | `GA4 - search` |

> For the `search` tag, after setting Event Name, click **Add parameter** under Event Parameters:
> - Parameter Name: `search_term`
> - Value: click the variable icon (lego block) → select `{{DLV - search_term}}`

---

## Final Checklist

- [ ] GA4 - view_item ✅ (done)
- [ ] GA4 - view_item_list ✅ (done)
- [ ] GA4 - select_item
- [ ] GA4 - add_to_cart
- [ ] GA4 - remove_from_cart
- [ ] GA4 - view_cart
- [ ] GA4 - add_to_wishlist
- [ ] GA4 - begin_checkout
- [ ] GA4 - add_shipping_info
- [ ] GA4 - add_payment_info
- [ ] GA4 - purchase
- [ ] GA4 - search

---

## After All Tags Are Done

1. Click **Preview** (top right in GTM)
2. Enter `https://gidanbackendtest.mymotokart.in` or `http://localhost:3000`
3. Browse the site — each action should show tags firing in the debug panel
4. Once verified → **Submit → Publish**
