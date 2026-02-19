'use client';

// import { Dialog, Transition } from '@headlessui/react';
// import { Fragment, useState } from 'react';
// import { X } from 'lucide-react';
// import axiosInstance from '../../../Axios/axiosInstance'; // Adjust the path if axiosInstance is located elsewhere
// import { enqueueSnackbar } from 'notistack';

// const OrderModal = ({ isOpen, onClose, order, orderid }) => {
//   const [showReturnPopup, setShowReturnPopup] = useState(false);
//   const [returnReason, setReturnReason] = useState('');
//   const [returnNotes, setReturnNotes] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   console.log(order,'--------=-=-==-==-=-');
  
//   const formatDate = (timestamp) => {
//     return new Date(timestamp).toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const getInvoice = async () => {
//     try {
//       const response = await axiosInstance.get(`/order/invoice/${orderid.id}/`, {
//         responseType: 'blob',
//       });

//       if (response.status === 200) {
//         const blob = new Blob([response.data], { type: 'application/pdf' });
//         const link = document.createElement('a');
//         link.href = URL.createObjectURL(blob);
//         link.download = `invoice_${order.id}.pdf`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(link.href);
//       }
//     } catch (error) {
//       console.error('Error downloading invoice:', error);
//     }
//   };

//   const reversedUpdates = [...(order?.tracking_updates || [])];

//   return (
//     <>
//       <Transition appear show={isOpen} as={Fragment}>
//         <Dialog as="div" className="relative z-50" onClose={onClose}>
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0 bg-black bg-opacity-25" />
//           </Transition.Child>

//           <div className="fixed inset-0 overflow-y-auto">
//             <div className="flex min-h-full items-center justify-center p-4 text-center">
//               <Transition.Child
//                 as={Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 scale-95"
//                 enterTo="opacity-100 scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 scale-100"
//                 leaveTo="opacity-0 scale-95"
//               >
//                 <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
//                   {/* Header */}
//                   <div className="flex justify-between items-center mb-4">
//                     <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
//                       Order Details
//                     </Dialog.Title>
//                     <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
//                       <X className="h-5 w-5" />
//                     </button>
//                   </div>

//                   {/* Content */}
//                   <div className="flex gap-6">
//                     {/* Status Timeline */}
//                     <div className="relative w-1/3">
//                       <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
//                       {reversedUpdates.map((update, index) => (
//                         <div key={index} className="relative flex items-start mb-6">
//                           <div className="absolute left-0 rounded-full border-2 border-green-500 bg-green-500 h-6 w-6 flex items-center justify-center">
//                             <div className="h-2 w-2 rounded-full bg-white"></div>
//                           </div>
//                           <div className="ml-10">
//                             <p className="font-medium">{update.status}</p>
//                             <p className="text-sm text-gray-500">{formatDate(update.timestamp)}</p>
//                             {update.notes && (
//                               <p className="text-sm text-gray-600 mt-1">{update.notes}</p>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Product Details */}
//                     <div className="w-2/3 max-h-64 overflow-y-auto custom-scrollbar">
//                       {order?.order_items?.map((item, index) => (
//                         <div key={index} className="flex gap-4 border-t border-b py-4">
//                           <div className="w-20 h-20">
//                             <img name=" "   
//                               src={`${process.env.NEXT_PUBLIC_API_URL}${item?.image}`}
//                               loading="lazy"
//                               alt={item?.product_name}
//                               className="w-full h-full object-contain"
//                             />
//                           </div>
//                           <div>
//                             <h4 className="font-medium">{item?.product_name}</h4>
//                             <p className="text-sm text-gray-500">{item?.delivery_option}</p>
//                             <p className="font-medium mt-1">₹{Math.round(item?.selling_price)}</p>

//                             {item?.mrp > item?.selling_price && (
//   <p className="text-sm line-through mt-1 ">
//     ₹{Math.round(item?.mrp || 0)}
//   </p>
// )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex gap-3 mt-6">
//                     {orderid?.status === 'DELIVERED' && (
//                       <button
//                         className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
//                         onClick={getInvoice}
//                       >
//                         Download Invoice
//                       </button>
//                 )} 
//                     {orderid?.status === 'DELIVERED' && orderid?.is_returnable && (
//   <button
//     onClick={() => setShowReturnPopup(true)}
//     className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
//   >
//     Return
//   </button>
// )}

//                   </div>
//                 </Dialog.Panel>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>

//       {/* Return Request Dialog */}
//       <Transition appear show={showReturnPopup} as={Fragment}>
//         <Dialog as="div" className="relative z-50" onClose={() => setShowReturnPopup(false)}>
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0 bg-black bg-opacity-25" />
//           </Transition.Child>

//           <div className="fixed inset-0 overflow-y-auto">
//             <div className="flex min-h-full items-center justify-center p-4 text-center">
//               <Transition.Child
//                 as={Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 scale-95"
//                 enterTo="opacity-100 scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 scale-100"
//                 leaveTo="opacity-0 scale-95"
//               >
//                 <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
//                   <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
//                     Request Return
//                   </Dialog.Title>

//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Reason</label>
//                       <select
//                         value={returnReason}
//                         onChange={(e) => setReturnReason(e.target.value)}
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
//                       >
//                         <option value="">Select a reason</option>
//                         <option value="Damaged product">Damaged product</option>
//                         <option value="Wrong item delivered">Wrong item delivered</option>
//                         <option value="Not as described">Not as described</option>
//                         <option value="Other">Other</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Notes (optional)</label>
//                       <textarea
//                         value={returnNotes}
//                         onChange={(e) => setReturnNotes(e.target.value)}
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
//                         rows="3"
//                       ></textarea>
//                     </div>

//                     <div className="flex justify-end gap-2 mt-4">
//                       <button
//                         onClick={() => setShowReturnPopup(false)}
//                         className="px-4 py-2 text-sm border border-gray-300 rounded-md"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         disabled={isSubmitting || !returnReason}
//                         onClick={async () => {
//                           setIsSubmitting(true);
//                           try {
//                              const response =  await axiosInstance.post(`/order/return/${orderid?.id}/`, {
//                               reason: returnReason,
//                               notes: returnNotes,
//                             });

//                             if (response.status== 200) {
//                               enqueueSnackbar('Return request submitted successfully',{variant:"success"});
//                               setShowReturnPopup(false);
//                               setReturnReason('');
//                               setReturnNotes('');
//                             }

//                           } catch (err) {
//                             console.error(err);
//                             enqueueSnackbar( 'Failed to submit return request');
//                           } finally {
//                             setIsSubmitting(false);
//                           }
//                         }}
//                         className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
//                       >
//                         {isSubmitting ? 'Submitting...' : 'Submit Return Request'}
//                       </button>
//                     </div>
//                   </div>
//                 </Dialog.Panel>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>
//     </>
//   );
// };

// export default OrderModal;



import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { X } from 'lucide-react';
import axiosInstance from '../../../Axios/axiosInstance';
import { enqueueSnackbar } from 'notistack';

const OrderModal = ({ isOpen, onClose, order, orderid }) => {
  const [showReturnPopup, setShowReturnPopup] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [returnNotes, setReturnNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

 const [imageFiles, setImageFiles] = useState([]); // Store uploaded image files

const handleImageUpload = (e) => {
  const files = Array.from(e.target.files);
  setImageFiles((prev) => [...prev, ...files]);
};

const removeImage = (index) => {
  const updated = [...imageFiles];
  updated.splice(index, 1);
  setImageFiles(updated);
};



  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInvoice = async () => {
    try {
      const response = await axiosInstance.get(`/order/invoice/${orderid.id}/`, {
        responseType: 'blob',
      });

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `invoice_${order.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };



  const handleSubmitReturn = async () => {
    setIsSubmitting(true);
    try {
      // ✅ Fetch product details from backend API
      const orderItemResponse = await axiosInstance.get(
        `https://backend.gidan.store/order/orderItem/?order_id=${orderid.id}`
      );

      const orderItems = orderItemResponse?.data?.data?.order_items || [];

// Build products list without images first
const products = orderItems.map((item) => ({
  product_sku: item.sku,
  price: item.mrp,
  amount: item.total,
  discount: item.discount,
}));

// ✅ Prepare FormData for binary upload
const formData = new FormData();
formData.append("return_order_status",  "R");
formData.append('notes', returnNotes || 'Customer requested refund');
formData.append('products', JSON.stringify(products));

// ✅ Append images as binary files
imageFiles.forEach((file, index) => {
  formData.append(`return_products_images`, file); 
});

// ✅ Send as multipart/form-data
const response = await axiosInstance.post(
  `/order/return/${orderid?.id}/`,
  formData,
  {
    headers: { 'Content-Type': 'multipart/form-data' },
  }
);


      if (response.status === 200) {
        enqueueSnackbar('Return request submitted successfully', { variant: 'success' });
        setShowReturnPopup(false);
        setReturnReason('');
        setReturnNotes('');
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to submit return request', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const reversedUpdates = [...(order?.tracking_updates || [])];

  return (
    <>
      {/* ===================== MAIN ORDER MODAL ===================== */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Order Details
                    </Dialog.Title>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex gap-6">
                    {/* Status Timeline */}
                    <div className="relative w-1/3">
                      <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
                      {reversedUpdates.map((update, index) => (
                        <div key={index} className="relative flex items-start mb-6">
                          <div className="absolute left-0 rounded-full border-2 border-green-500 bg-green-500 h-6 w-6 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                          </div>
                          <div className="ml-10">
                            <p className="font-medium">{update.status}</p>
                            <p className="text-sm text-gray-500">{formatDate(update.timestamp)}</p>
                            {update.notes && (
                              <p className="text-sm text-gray-600 mt-1">{update.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Product Details */}
                    <div className="w-2/3 max-h-64 overflow-y-auto custom-scrollbar">
                      {order?.order_items?.map((item, index) => (
                        <div key={index} className="flex gap-4 border-t border-b py-4">
                          <div className="w-20 h-20">
                            <img
                              name=" "
                              src={`${process.env.NEXT_PUBLIC_API_URL}${item?.image}`}
                              loading="lazy"
                              alt={item?.product_name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{item?.product_name}</h4>
                            <p className="text-sm text-gray-500">{item?.delivery_option}</p>
                            <p className="font-medium mt-1">₹{Math.round(item?.selling_price)}</p>

                            {item?.mrp > item?.selling_price && (
                              <p className="text-sm line-through mt-1">
                                ₹{Math.round(item?.mrp || 0)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    {orderid?.status === 'DELIVERED' && (
                      <button
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                        onClick={getInvoice}
                      >
                        Download Invoice
                      </button>
                    )}
                    {orderid?.status === 'DELIVERED' && orderid?.is_returnable && (
                      <button
                        onClick={() => setShowReturnPopup(true)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                      >
                        Return
                      </button>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* ===================== RETURN REQUEST POPUP ===================== */}
      <Transition appear show={showReturnPopup} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowReturnPopup(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                    Request Return
                  </Dialog.Title>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Reason</label>
                      <select
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                      >
                        <option value="">Select a reason</option>
                        <option value="Damaged product">Damaged product</option>
                        <option value="Wrong item delivered">Wrong item delivered</option>
                        <option value="Not as described">Not as described</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Notes (optional)</label>
                      <textarea
                        value={returnNotes}
                        onChange={(e) => setReturnNotes(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                        rows="3"
                      ></textarea>
                    </div>

{/* ✅ Image upload section */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Upload Product Images (for damaged/return items)
  </label>
  <input
    type="file"
    multiple
    accept="image/*"
    onChange={handleImageUpload}
    className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2"
  />

  {/* Preview uploaded images */}
  <div className="mt-3 flex flex-wrap gap-3">
    {imageFiles.map((file, index) => (
      <div key={index} className="relative w-20 h-20">
        <img
          src={URL.createObjectURL(file)}
          alt={`upload-${index}`}
          className="w-full h-full object-cover rounded-md border"
        />
        <button
          onClick={() => removeImage(index)}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5"
        >
          ✕
        </button>
      </div>
    ))}
  </div>
</div>


                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => setShowReturnPopup(false)}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={isSubmitting || !returnReason}
                        onClick={handleSubmitReturn}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Return Request'}
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default OrderModal;
