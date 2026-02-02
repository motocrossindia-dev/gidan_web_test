import React, { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, Gift, CreditCard } from "lucide-react";
import { useLocation } from "react-router-dom";
import {Helmet} from "react-helmet";

const BTCoinsHistory = () => {
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  
  const transactions = location.state?.resourse || [];
  const data = location.state?.data || { total_coins: 0 };

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
        <Helmet>
  <title>Gidan - BTCoins History</title>

  <meta
    name="description"
    content="Check your Gidan BTCoins history to track all earned and spent coins. Stay updated on your rewards and enjoy a seamless gardening shopping experience."
  />

  <link
    rel="canonical"
    href="https://gidan.store/profile/history"
  />
</Helmet>

    <div className="flex justify-center sm:justify-start px-4 sm:px-6 bg-gray-100 min-h-screen w-full">
      <div className="w-full sm:w-full md:w-4/5 lg:w-full xl:w-full h-auto bg-white shadow-lg p-4 sm:p-6 rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">BT Coins History</h2>
          <div className="text-right">
            <p className="text-sm text-gray-600">Current Balance</p>
            <p className="text-xl font-bold text-green-600">{data.total_coins} Coins</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button 
            onClick={() => setActiveFilter('ALL')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'ALL' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveFilter('EARN')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'EARN' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Earned
          </button>
          <button 
            onClick={() => setActiveFilter('SPENT')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'SPENT' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                    <div className={`p-2 rounded-full ${
                      isEarned ? "bg-green-100" : "bg-orange-100"
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        isEarned ? "text-green-600" : "text-orange-600"
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.reference}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`flex items-center font-semibold ${
                      isEarned ? "text-green-600" : "text-orange-600"
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
            <div className="text-center text-gray-500 py-6 bg-white rounded-lg">
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

export default BTCoinsHistory;