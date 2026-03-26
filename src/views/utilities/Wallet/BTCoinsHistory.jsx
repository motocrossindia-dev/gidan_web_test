'use client';

import React, { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, Gift, CreditCard, ChevronLeft } from "lucide-react";
import Breadcrumb from "../../../components/Shared/Breadcrumb";
import { useRouter } from "next/navigation";

const GDCoinsHistory = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const transactions = null?.resourse || [];
  const data = null?.data || { total_coins: 0 };

  // Helper function to determine transaction icon
  const getTransactionIcon = (reference) => {
    if (reference.toLowerCase().includes('referral')) {
      return Gift;
    }
    return CreditCard;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (activeFilter === 'ALL') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter(t => t.transaction_type === activeFilter));
    }
  }, [activeFilter, transactions]);

  return (
    <>
      <div className="flex md:hidden items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-40">
        <button
          onClick={() => router.push('/profile')}
          className="flex items-center gap-1 text-bio-green bg-green-50 px-3 py-1.5 rounded-full border border-green-200 transition-all hover:bg-green-100"
        >
          <ChevronLeft size={16} />
          <span className="text-sm font-medium">Profile</span>
        </button>
        <h1 className="text-lg font-semibold absolute left-1/2 -translate-x-1/2">GD Coins</h1>
        <div className="w-10"></div>
      </div>

      <div className="mt-2 md:hidden text-xs sm:text-sm">
        <Breadcrumb 
          items={[{ label: 'Profile', path: '/profile' }]} 
          currentPage="GD Coins" 
        />
      </div>

      <div className="flex justify-center sm:justify-start px-4 sm:px-6 bg-site-bg min-h-screen w-full mt-2">
        <div className="w-full sm:w-full md:w-4/5 lg:w-full xl:w-full h-auto bg-white shadow-lg p-4 sm:p-6 rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">GD Coins History</h2>
            <div className="text-right">
              <p className="text-sm text-gray-600">Current Balance</p>
              <p className="text-xl font-bold text-[#375421]">{data.total_coins} Coins</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button aria-label="Toggle filters"
              onClick={() => setActiveFilter('ALL')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'ALL'
                ? 'bg-[#375421] text-white'
                : 'bg-site-bg text-gray-700 hover:bg-gray-200'
                }`}
            >
              All
            </button>
            <button aria-label="Toggle filters"
              onClick={() => setActiveFilter('EARN')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'EARN'
                ? 'bg-[#375421] text-white'
                : 'bg-site-bg text-gray-700 hover:bg-gray-200'
                }`}
            >
              Earned
            </button>
            <button aria-label="Toggle filters"
              onClick={() => setActiveFilter('SPENT')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'SPENT'
                ? 'bg-[#375421] text-white'
                : 'bg-site-bg text-gray-700 hover:bg-gray-200'
                }`}
            >
              Spent
            </button>
          </div>

          {/* Transactions List */}
          <div className="space-y-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => {
                const Icon = getTransactionIcon(transaction.reference);
                const isEarned = transaction.transaction_type === "EARN";

                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${isEarned ? "bg-green-100" : "bg-orange-100"
                        }`}>
                        <Icon className={`h-5 w-5 ${isEarned ? "text-[#375421]" : "text-orange-600"
                          }`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.reference}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`flex items-center font-semibold ${isEarned ? "text-[#375421]" : "text-orange-600"
                        }`}>
                        {isEarned ? (
                          <ArrowUpRight className="h-5 w-5 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 mr-1" />
                        )}
                        {isEarned ? "+" : "-"}{transaction.coins} Coins
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-600 py-6 bg-white rounded-lg">
                <p className="text-lg font-semibold">No transactions found</p>
                <p className="text-sm">No transaction happened from this account.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GDCoinsHistory;
// =========================odl=========================
// import React, { useState, useEffect } from "react";
// import { ArrowUpRight, ArrowDownRight, Gift, CreditCard } from "lucide-react";
// // //
// const BTCoinsHistory = () => {
//   const searchParams = useSearchParams();
//   const pathname = usePathname();
//   const [activeFilter, setActiveFilter] = useState('ALL');
//   const [filteredTransactions, setFilteredTransactions] = useState([]);
//
//   const transactions = null?.resourse || [];
//   const data = null?.data || { total_coins: 0 };
//
//   // Helper function to determine transaction icon
//   const getTransactionIcon = (reference) => {
//     if (reference.toLowerCase().includes('referral')) {
//       return Gift;
//     }
//     return CreditCard;
//   };
//
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);
//
//   useEffect(() => {
//     if (activeFilter === 'ALL') {
//       setFilteredTransactions(transactions);
//     } else {
//       setFilteredTransactions(transactions.filter(t => t.transaction_type === activeFilter));
//     }
//   }, [activeFilter, transactions]);
//
//   return (
//       <>
//         
//
//     <div className="flex justify-center sm:justify-start px-4 sm:px-6 bg-site-bg min-h-screen w-full">
//       <div className="w-full sm:w-full md:w-4/5 lg:w-full xl:w-full h-auto bg-white shadow-lg p-4 sm:p-6 rounded-lg">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-semibold">BT Coins History</h2>
//           <div className="text-right">
//             <p className="text-sm text-gray-600">Current Balance</p>
//             <p className="text-xl font-bold text-[#375421]">{data.total_coins} Coins</p>
//           </div>
//         </div>
//
//         {/* Filters */}
//         <div className="flex flex-wrap gap-2 mb-6">
//           <button
//             onClick={() => setActiveFilter('ALL')}
//             className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
//               activeFilter === 'ALL'
//                 ? 'bg-[#375421] text-white'
//                 : 'bg-site-bg text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             All
//           </button>
//           <button
//             onClick={() => setActiveFilter('EARN')}
//             className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
//               activeFilter === 'EARN'
//                 ? 'bg-[#375421] text-white'
//                 : 'bg-site-bg text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             Earned
//           </button>
//           <button
//             onClick={() => setActiveFilter('SPENT')}
//             className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
//               activeFilter === 'SPENT'
//                 ? 'bg-[#375421] text-white'
//                 : 'bg-site-bg text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             Spent
//           </button>
//         </div>
//
//         {/* Transactions List */}
//         <div className="space-y-4">
//           {filteredTransactions.length > 0 ? (
//             filteredTransactions.map((transaction) => {
//               const Icon = getTransactionIcon(transaction.reference);
//               const isEarned = transaction.transaction_type === "EARN";
//
//               return (
//                 <div
//                   key={transaction.id}
//                   className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg hover:shadow-md transition-shadow"
//                 >
//                   <div className="flex items-center space-x-4">
//                     <div className={`p-2 rounded-full ${
//                       isEarned ? "bg-green-100" : "bg-orange-100"
//                     }`}>
//                       <Icon className={`h-5 w-5 ${
//                         isEarned ? "text-[#375421]" : "text-orange-600"
//                       }`} />
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">{transaction.reference}</p>
//                       <p className="text-sm text-gray-500">
//                         {new Date(transaction.created_at).toLocaleDateString("en-US", {
//                           year: "numeric",
//                           month: "long",
//                           day: "numeric",
//                         })}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center">
//                     <span className={`flex items-center font-semibold ${
//                       isEarned ? "text-[#375421]" : "text-orange-600"
//                     }`}>
//                       {isEarned ? (
//                         <ArrowUpRight className="h-5 w-5 mr-1" />
//                       ) : (
//                         <ArrowDownRight className="h-5 w-5 mr-1" />
//                       )}
//                       {isEarned ? "+" : "-"}{transaction.coins} Coins
//                     </span>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="text-center text-gray-500 py-6 bg-white rounded-lg">
//               <p className="text-lg font-semibold">No transactions found</p>
//               <p className="text-sm">No transaction happened from this account.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//         </>
//   );
// };
//
// export default BTCoinsHistory;