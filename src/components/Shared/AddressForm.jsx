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
  saveLabel = 'Save Address',
  cancelLabel = 'Cancel',
  variant = 'checkout',
  formIndex = 0,
}) => {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues });

  const handleChange = (field, value) => {
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
    if (onSave) onSave(form);
  };

  // ── Styles ──────────────────────────────────────────────
  const isCheckout = variant === 'checkout';

  const inputBase = isCheckout
    ? 'w-full border rounded-lg px-4 py-2'
    : 'p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full';

  const inputReadOnly = isCheckout
    ? `${inputBase} bg-gray-100 cursor-not-allowed`
    : `${inputBase} bg-gray-100 cursor-not-allowed`;

  const formWrapper = isCheckout
    ? 'space-y-3'
    : 'grid grid-cols-1 md:grid-cols-2 gap-4';

  const fullWidth = isCheckout ? '' : 'md:col-span-2';

  const saveBtnClass = isCheckout
    ? 'w-full py-3 bg-green-600 text-white rounded-lg font-medium'
    : 'bg-bio-green text-white font-semibold py-2 px-4 rounded hover:bg-green-600';

  const cancelBtnClass = isCheckout
    ? 'w-full py-3 border border-gray-300 rounded-lg font-medium'
    : 'border border-bio-green text-bio-green font-semibold py-2 px-4 rounded hover:bg-green-100';

  const buttonWrapper = isCheckout ? 'p-4 space-y-3' : 'flex space-x-4 mt-4';

  // ── Render ───────────────────────────────────────────────
  return (
    <div>
      <form className={formWrapper} onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="First Name"
          value={form.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          className={inputBase}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={form.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          className={inputBase}
          required
        />
        <input
          type="text"
          placeholder="Apartment, Suite, etc. (optional)"
          value={form.address}
          onChange={(e) => handleChange('address', e.target.value)}
          className={`${inputBase} ${fullWidth}`}
        />
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="PIN Code"
          value={form.pinCode}
          maxLength={6}
          onChange={(e) =>
            handleChange('pinCode', e.target.value.replace(/[^0-9]/g, '').slice(0, 6))
          }
          className={inputBase}
          required
        />
        <input
          type="text"
          placeholder="City (Auto-filled by PIN Code)"
          value={form.city}
          readOnly
          className={inputReadOnly}
        />
        <input
          type="text"
          placeholder="State (Auto-filled by PIN Code)"
          value={form.state}
          readOnly
          className={inputReadOnly}
        />
        <input
          type="tel"
          placeholder="Phone"
          value={form.phone}
          maxLength={10}
          inputMode="numeric"
          onChange={(e) =>
            handleChange('phone', e.target.value.replace(/[^0-9]/g, '').slice(0, 10))
          }
          className={`${inputBase} ${fullWidth}`}
          required
        />

        <div className={`${isCheckout ? 'pt-2' : 'mt-4'} ${fullWidth}`}>
          <p className={`${isCheckout ? 'text-sm' : ''} font-medium mb-2`}>Address Type</p>
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
        {isCheckout && (
          <button onClick={onCancel} className={cancelBtnClass}>
            {cancelLabel}
          </button>
        )}
        <button onClick={handleSave} className={saveBtnClass}>
          {saveLabel}
        </button>
        {!isCheckout && (
          <button onClick={onCancel} className={cancelBtnClass}>
            {cancelLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressForm;
