import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Gift, CreditCard } from "lucide-react";
import {Helmet} from "react-helmet";

const WalletHistory = () => {
  const location = useLocation();
  const data = location.state?.resourse || {};
  const allTransactions = data.transactions || [];
  const balance = data.balance || 0;

  const [activeType, setActiveType] = useState('ALL');
  const [activeStatus, setActiveStatus] = useState('ALL');
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const getTransactionIcon = (reference) => {
    if (reference?.toLowerCase().includes('referral')) return Gift;
    return CreditCard;
  };

  useEffect(() => {
    let filtered = [...allTransactions];

    if (activeType !== 'ALL') {
      filtered = filtered.filter(t => t.transaction_type === activeType);
    }

    if (activeStatus !== 'ALL') {
      filtered = filtered.filter(t => t.status === activeStatus);
    }

    setFilteredTransactions(filtered);
  }, [activeType, activeStatus, allTransactions]);

  return (

      <>
        <Helmet>
          <title>Gidan - Wallet History</title>
        </Helmet>
    <div className="flex justify-center sm:justify-start px-4 sm:px-6 bg-gray-100 min-h-screen w-full mt-2 sm:mt-3">
      <div className="w-full sm:w-full md:w-4/5 lg:w-full xl:w-full h-auto bg-white shadow-lg p-4 sm:p-6 rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Wallet History</h2>
          <div className="text-right">
            <p className="text-sm text-gray-600">Current Balance</p>
            <p className="text-xl font-bold text-green-600">{balance} Coins</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Type Filter */}
          

          {/* Status Filter */}
          <div className="flex gap-2">
            {['ALL', 'COMPLETED', 'PENDING'].map(status => (
              <button 
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeStatus === status 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => {
              const Icon = getTransactionIcon(transaction.reference_id);
              const isEarned = transaction.transaction_type === 'CREDIT';

              return (
                <div
                  key={transaction.reference_id || index}
                  className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      isEarned ? "bg-green-100" : "bg-orange-100"
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        isEarned ? "text-green-600" : "text-orange-600"
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description || transaction.reference_id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-gray-400">Status: {transaction.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`flex items-center font-semibold ${
                      isEarned ? "text-green-600" : "text-orange-600"
                    }`}>
                      {isEarned ? <ArrowUpRight className="h-5 w-5 mr-1" /> : <ArrowDownRight className="h-5 w-5 mr-1" />}
                      {isEarned ? "+" : "-"}{transaction.amount} Coins
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 py-6 bg-white rounded-lg">
              <p className="text-lg font-semibold">No transactions found</p>
              <p className="text-sm">Try changing the filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>

        </>
  );
};

export default WalletHistory;
