'use client';




import Link from "next/link";
import React, { useEffect } from "react";
import notificationImage from "../../../Assets/Noti.webp"; // Ensure the path is correct
const Notification = () => {
  const dummyNotifications = [
    {
      id: 3,
      title: "Peace Lily Plant (Roma Pot) is waiting to be yours. Hurry, complete your order now!",
      price: "₹499.00",
      date: "21 Aug 2024",
      imageSrc: notificationImage,
    },
    {
      id: 1,

      title: "Peace Lily Plant (Roma Pot) is waiting to be yours. Hurry, complete your order now!",
      price: "₹499.00",
      date: "21 Aug 2024",
      imageSrc: notificationImage,
    },
    {
      id: 1,

      title: "Peace Lily Plant (Roma Pot) is waiting to be yours. Hurry, complete your order now!",
      price: "₹499.00",
      date: "21 Aug 2024",
      imageSrc: notificationImage,
    },
    {
      id: 1,

      title: "Peace Lily Plant (Roma Pot) is waiting to be yours. Hurry, complete your order now!",
      price: "₹499.00",
      date: "21 Aug 2024",
      imageSrc: notificationImage,
    },
    {
      id: 1,

      title: "Peace Lily Plant (Roma Pot) is waiting to be yours. Hurry, complete your order now!",
      price: "₹499.00",
      date: "21 Aug 2024",
      imageSrc: notificationImage,
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top
  }, []);

  return (
    <div className="flex justify-center px-4 bg-gray-100 min-h-screen">
      <div className="w-full bg-white p-4 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Notifications</h2>
        <div className="space-y-2">
          {dummyNotifications.map((notification, index) => (
            <div
              key={index}
              className="flex items-center border rounded-lg p-4 bg-gray-50 shadow-sm"
            >
              <img name=" "   
                src={notification.imageSrc}
                alt="Product"
                loading="lazy"
                className="w-16 h-16 object-cover rounded-lg mr-4"
              />
              <div className="flex flex-col flex-1">
                <h3 className="text-sm font-semibold text-gray-800 leading-snug">
                  {notification.title}
                </h3>
                <p className="text-gray-600 text-sm">{notification.price}</p>
                <p className="text-xs text-gray-400">{notification.date}</p>
              </div>
              <Link to={`productdata/${notification.id}`} className="text-green-600 text-sm font-semibold ml-auto">
  More Details &rarr;
</Link>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notification;
