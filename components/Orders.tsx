"use client";

import { getOrders } from "@/app/handler/orderHandlers";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const order = await getOrders();
      console.log("Fetched Orders:", order);
      setOrders(order.orders);
    };
    fetchOrders();
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Orders</h1>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order: any) => (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold mb-4">
                {order.customerName || "Unnamed Customer"}
              </h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {order.phoneNumber}
                </p>
                <p>
                  <span className="font-medium">Card:</span> **** **** ****{" "}
                  {order.cardNumber.slice(-4)}
                </p>
                <p>
                  <span className="font-medium">Order Date:</span>{" "}
                  {format(new Date(order.currentDate), "MMM d, yyyy")}
                </p>
                <p>
                  <span className="font-medium">Delivery Date:</span>{" "}
                  {format(new Date(order.deliveryDate), "MMM d, yyyy")}
                </p>
                <p>
                  <span className="font-medium">Advance:</span> ${order.advance}
                </p>
                <p>
                  <span className="font-medium">Total:</span> $
                  {order.grandTotal}
                </p>
                <p>
                  <span className="font-medium">Remaining:</span> $
                  {order.remainingTotal}
                </p>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Items:</h3>
                <ul className="space-y-2">
                  {order.items.map((item: any) => (
                    <li
                      key={item.id}
                      className="bg-gray-100 dark:bg-gray-700 p-2 rounded"
                    >
                      <p className="font-medium">{item.name}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ${item.price}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
