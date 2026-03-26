'use client';

import React, { useState } from 'react';

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  pinCode: '',
  phone: '',
  addressType: 'Home',
};

/**
 * Shared reusable address form component.
 *
 * Props:
 *  - initialValues  : object  – pre-fill the form fields (for edit mode)
 *  - onSave(data)   : fn      – called with form data when user saves
 *  - onCancel()     : fn      – called when user cancels
 *  - saveLabel      : string  – save button label (default "Save Address")
 *  - cancelLabel    : string  – cancel button label (default "Cancel")
 *  - variant        : "checkout" | "profile"  – layout style (default "checkout")
 *  - formIndex      : number  – index used for unique radio name (profile map)
 */
const AddressForm = ({
  initialValues = {},
  onSave,
  onCancel,
  showCancel = true,
  saveLabel = 'Save Address',
  cancelLabel = 'Cancel',
  variant = 'checkout',
  formIndex = 0,
}) => {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'pinCode' && String(value).length !== 6) {
        updated.city = '';
        updated.state = '';
      }
      return updated;
    });

    if (field === 'pinCode') {
      const pinStr = String(value).trim();
      if (pinStr.length === 6) {
        fetch(`https://api.postalpincode.in/pincode/${pinStr}`)
          .then((res) => res.json())
          .then((data) => {
            if (data && data[0].Status === 'Success') {
              const po = data[0].PostOffice[0];
              setForm((prev) => ({
                ...prev,
                city: po.District || po.Block || po.Name || '',
                state: po.State || '',
              }));
            } else {
              setForm((prev) => ({ ...prev, city: '', state: '' }));
            }
          })
          .catch((err) => console.error('Pincode lookup error:', err));
      }
    }
  };

  const handleSave = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!form.address.trim()) newErrors.address = 'Address is required.';
    if (!form.pinCode || String(form.pinCode).length !== 6) newErrors.pinCode = 'Enter a valid 6-digit PIN code.';
    if (!form.city.trim()) newErrors.city = 'City is required. Enter a valid PIN code to auto-fill.';
    if (!form.state.trim()) newErrors.state = 'State is required. Enter a valid PIN code to auto-fill.';
    if (!form.phone || String(form.phone).length !== 10) newErrors.phone = 'Enter a valid 10-digit phone number.';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (onSave) onSave(form);
  };

  // ── Styles ──────────────────────────────────────────────
  const isCheckout = variant === 'checkout';

  const inputBase = isCheckout
    ? 'w-full border rounded-lg px-4 py-2'
    : 'p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full';

  const inputReadOnly = isCheckout
    ? `${inputBase} bg-site-bg cursor-not-allowed`
    : `${inputBase} bg-site-bg cursor-not-allowed`;

  const formWrapper = isCheckout
    ? 'space-y-3'
    : 'grid grid-cols-1 md:grid-cols-2 gap-4';

  const fullWidth = isCheckout ? '' : 'md:col-span-2';

  const saveBtnClass = isCheckout
    ? 'w-full py-3 bg-[#375421] text-white rounded-lg font-medium'
    : 'bg-bio-green text-white font-semibold py-2 px-4 rounded hover:bg-[#375421] hover:text-white';

  const cancelBtnClass = isCheckout
    ? 'w-full py-3 border border-gray-300 rounded-lg font-medium'
    : 'border border-bio-green text-bio-green font-semibold py-2 px-4 rounded hover:bg-green-100';

  const buttonWrapper = isCheckout ? 'p-4 space-y-3' : 'flex space-x-4 mt-4';

  // ── Render ───────────────────────────────────────────────
  return (
    <div>
      <form className={formWrapper} onSubmit={(e) => e.preventDefault()}>
        <div className={errors.firstName ? 'space-y-1' : ''}>
          <input
            type="text"
            placeholder="First Name *"
            value={form.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className={`${inputBase}${errors.firstName ? ' border-red-500' : ''}`}
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
        </div>
        <div className={errors.lastName ? 'space-y-1' : ''}>
          <input
            type="text"
            placeholder="Last Name *"
            value={form.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className={`${inputBase}${errors.lastName ? ' border-red-500' : ''}`}
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
        </div>
        <div className={`${fullWidth}${errors.address ? ' space-y-1' : ''}`}>
          <input
            type="text"
            placeholder="Apartment, Suite, etc. *"
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className={`${inputBase}${errors.address ? ' border-red-500' : ''}`}
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>
        <div className={errors.pinCode ? 'space-y-1' : ''}>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="PIN Code *"
            value={form.pinCode}
            maxLength={6}
            onChange={(e) =>
              handleChange('pinCode', e.target.value.replace(/[^0-9]/g, '').slice(0, 6))
            }
            className={`${inputBase}${errors.pinCode ? ' border-red-500' : ''}`}
          />
          {errors.pinCode && <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>}
        </div>
        <div className={errors.city ? 'space-y-1' : ''}>
          <input
            type="text"
            placeholder="City (Auto-filled by PIN Code) *"
            value={form.city}
            readOnly
            className={`${inputReadOnly}${errors.city ? ' border-red-500' : ''}`}
          />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
        </div>
        <div className={errors.state ? 'space-y-1' : ''}>
          <input
            type="text"
            placeholder="State (Auto-filled by PIN Code) *"
            value={form.state}
            readOnly
            className={`${inputReadOnly}${errors.state ? ' border-red-500' : ''}`}
          />
          {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
        </div>
        <div className={`${fullWidth}${errors.phone ? ' space-y-1' : ''}`}>
          <input
            type="tel"
            placeholder="Phone *"
            value={form.phone}
            maxLength={10}
            inputMode="numeric"
            onChange={(e) =>
              handleChange('phone', e.target.value.replace(/[^0-9]/g, '').slice(0, 10))
            }
            className={`${inputBase}${errors.phone ? ' border-red-500' : ''}`}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        <div className={`${isCheckout ? 'pt-2' : 'mt-4'} ${fullWidth}`}>
          <p className={`${isCheckout ? 'text-sm' : ''} font-medium mb-2`}>Address Type *</p>
          <div className="flex space-x-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name={`addressType-${formIndex}`}
                value="Home"
                checked={form.addressType === 'Home'}
                onChange={(e) => handleChange('addressType', e.target.value)}
                className="mr-2"
              />
              Home (All day delivery)
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name={`addressType-${formIndex}`}
                value="Work"
                checked={form.addressType === 'Work'}
                onChange={(e) => handleChange('addressType', e.target.value)}
                className="mr-2"
              />
              Work/Office (9am–5pm)
            </label>
          </div>
        </div>
      </form>

      <div className={buttonWrapper}>
        {showCancel && isCheckout && (
          <button onClick={onCancel} className={cancelBtnClass}>
            {cancelLabel}
          </button>
        )}
        <button onClick={handleSave} className={saveBtnClass}>
          {saveLabel}
        </button>
        {showCancel && !isCheckout && (
          <button onClick={onCancel} className={cancelBtnClass}>
            {cancelLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressForm;
