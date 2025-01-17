'use client'

import { getOrders } from "@/app/handler/orderHandlers";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Search } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const order = await getOrders();
      console.log("Fetched Orders:", order);
      setOrders(order.orders);
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order: any) =>
    order.phoneNumber.includes(searchTerm) || order.cardNumber.includes(searchTerm)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search by phone or card number"
          className="w-full p-2 pl-10 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Customer Name</th>
              <th className="border p-2 text-left">Phone Number</th>
              <th className="border p-2 text-left">Card Number</th>
              <th className="border p-2 text-left">Delivery Date</th>
              <th className="border p-2 text-left">Total Remaining</th>
              <th className="border p-2 text-left">Items</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order: any) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="border p-2">{order.customerName || 'Unnamed Customer'}</td>
                <td className="border p-2">{order.phoneNumber}</td>
                <td className="border p-2">{order.cardNumber}</td>
                <td className="border p-2">{format(new Date(order.deliveryDate), 'dd/MM/yyyy')}</td>
                <td className="border p-2">₹{order.remainingTotal}</td>
                <td className="border p-2">
                  <ul>
                    {order.items.map((item: any, index: number) => (
                      <li key={index}>
                        {item.name} (Qty: {item.quantity}, Price: ₹{item.price})
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;

