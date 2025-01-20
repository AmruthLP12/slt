"use client";

import { getOrders } from "@/app/handler/orderHandlers";
import type React from "react";
import { useEffect, useState } from "react";
import { format, isEqual, parseISO, startOfDay } from "date-fns";
import { Search, CalendarIcon } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Order {
  _id: string;
  cardNumber: string;
  customerName: string;
  phoneNumber: string;
  deliveryDate: string;
  isDelivered: boolean;
  deliveredDate?: string;
  advance: number;
  grandTotal: number;
  remainingTotal: number;
}

const Orders = () => {
  const { toast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deliveryDateFilter, setDeliveryDateFilter] = useState<
    Date | undefined
  >(undefined);
  const [currentDateFilter, setCurrentDateFilter] = useState<Date | undefined>(
    undefined
  );
  const [deliveredDateFilter, setDeliveredDateFilter] = useState<
    Date | undefined
  >(undefined);
  const [deliveryStatus, setDeliveryStatus] = useState("all");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newDeliveryStatus, setNewDeliveryStatus] = useState<boolean>(false);
  const [newDeliveryDate, setNewDeliveryDate] = useState<Date | undefined>(
    undefined
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const order = await getOrders();
      console.log("Fetched Orders:", order);
      setOrders(order.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter((order: Order) => {
    const matchesSearch =
      order.phoneNumber.includes(searchTerm) ||
      order.cardNumber.includes(searchTerm);

    const orderDeliveryDate = startOfDay(parseISO(order.deliveryDate));
    const matchesDeliveryDate =
      !deliveryDateFilter ||
      isEqual(orderDeliveryDate, startOfDay(deliveryDateFilter));

    const currentDate = startOfDay(new Date());
    const matchesCurrentDate =
      !currentDateFilter || isEqual(currentDate, startOfDay(currentDateFilter));

    const orderDeliveredDate = order.deliveredDate
      ? startOfDay(parseISO(order.deliveredDate))
      : undefined;
    const matchesDeliveredDate =
      !deliveredDateFilter ||
      (orderDeliveredDate &&
        isEqual(orderDeliveredDate, startOfDay(deliveredDateFilter)));

    const matchesDeliveryStatus =
      deliveryStatus === "all" ||
      (deliveryStatus === "delivered" && order.isDelivered) ||
      (deliveryStatus === "undelivered" && !order.isDelivered);

    return (
      matchesSearch &&
      matchesDeliveryDate &&
      matchesCurrentDate &&
      (deliveredDateFilter ? matchesDeliveredDate : true) &&
      matchesDeliveryStatus
    );
  });

  const handleDeliveryToggle = (order: Order) => {
    setSelectedOrder(order);
    setNewDeliveryStatus(!order.isDelivered);
    setNewDeliveryDate(
      order.isDelivered
        ? undefined
        : order.deliveredDate
        ? parseISO(order.deliveredDate)
        : new Date()
    );
    setIsUpdateModalOpen(true);
  };

  const updateOrderStatus = async () => {
    if (!selectedOrder) return;

    try {
      const response = await fetch(`/api/orders/${selectedOrder._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isDelivered: newDeliveryStatus,
          deliveredDate: newDeliveryStatus
            ? newDeliveryDate?.toISOString()
            : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      setOrders(
        orders.map((order) =>
          order._id === selectedOrder._id
            ? {
                ...order,
                isDelivered: newDeliveryStatus,
                deliveredDate: newDeliveryStatus
                  ? newDeliveryDate?.toISOString()
                  : undefined,
              }
            : order
        )
      );

      toast({
        title: "Order Updated",
        description: `Order ${selectedOrder._id} has been ${
          newDeliveryStatus ? "marked as delivered" : "marked as undelivered"
        }.`,
      });

      setIsUpdateModalOpen(false);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;

    try {
      const response = await fetch(`/api/orders/${selectedOrder._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete order");
      }

      setOrders(orders.filter((order) => order._id !== selectedOrder._id));

      toast({
        title: "Order Deleted",
        description: `Order ${selectedOrder._id} has been deleted.`,
      });

      setIsDeleteModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        title: "Error",
        description: "Failed to delete order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const DatePicker = ({
    date,
    setDate,
    label,
  }: {
    date: Date | undefined;
    setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
    label: string;
  }) => (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>{label}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      {isLoading ? (
        <div className="text-center">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center">No orders found.</div>
      ) : (
        <>
          <div className="mb-6 space-y-4">
            <div className="flex items-center space-x-4 justify-between">
              <input
                type="text"
                placeholder="Search by phone or card number"
                className="w-full p-2 pl-10 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 text-gray-400" size={20} />
              <DatePicker
                date={deliveryDateFilter}
                setDate={setDeliveryDateFilter}
                label="Delivery Date"
              />
              <DatePicker
                date={currentDateFilter}
                setDate={setCurrentDateFilter}
                label="Current Date"
              />
              <DatePicker
                date={deliveredDateFilter}
                setDate={setDeliveredDateFilter}
                label="Delivered Date"
              />
            </div>

            <Select value={deliveryStatus} onValueChange={setDeliveryStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Delivery Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="undelivered">Undelivered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Card Number</th>
                  <th className="border p-2 text-left">Customer Name</th>
                  <th className="border p-2 text-left">Phone Number</th>
                  <th className="border p-2 text-left">Delivery Date</th>
                  <th className="border p-2 text-left">Current Date</th>
                  <th className="border p-2 text-left">Delivered Date</th>
                  <th className="border p-2 text-left">Total Amount</th>
                  <th className="border p-2 text-left">Advance</th>
                  <th className="border p-2 text-left">Remaining Amount</th>
                  <th className="border p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order: Order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="border p-2">
                      <Link
                        href={`/dashboard/orders/${order._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {order.cardNumber}
                      </Link>
                    </td>
                    <td className="border p-2">
                      {order.customerName || "Unnamed Customer"}
                    </td>
                    <td className="border p-2">{order.phoneNumber}</td>
                    <td className="border p-2">
                      {format(parseISO(order.deliveryDate), "dd/MM/yyyy")}
                    </td>
                    <td className="border p-2">
                      {format(new Date(), "dd/MM/yyyy")}
                    </td>
                    <td className="border p-2">
                      {order.isDelivered && order.deliveredDate
                        ? format(parseISO(order.deliveredDate), "dd/MM/yyyy")
                        : "Not Delivered"}
                    </td>
                    <td className="border p-2 text-blue-600 font-semibold">
                      ₹{order.grandTotal}
                    </td>
                    <td className="border p-2 text-green-600 font-semibold">
                      ₹{order.advance}
                    </td>
                    <td className="border p-2 text-red-600 font-semibold">
                      ₹{order.remainingTotal}
                    </td>
                    <td className="border p-2">
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleDeliveryToggle(order)}
                          variant={
                            order.isDelivered ? "destructive" : "default"
                          }
                        >
                          {order.isDelivered
                            ? "Unmark Delivered"
                            : "Mark Delivered"}
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDeleteModalOpen(true);
                          }}
                          variant="outline"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {isUpdateModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Update Order Status</h2>
            <p>Order: {selectedOrder.cardNumber}</p>
            <p className="my-4">
              {newDeliveryStatus
                ? "Are you sure you want to mark this order as delivered?"
                : "Are you sure you want to mark this order as undelivered?"}
            </p>
            {newDeliveryStatus && (
              <div className="my-4">
                <label className="block mb-2">Delivery Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newDeliveryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newDeliveryDate ? (
                        format(newDeliveryDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newDeliveryDate}
                      onSelect={setNewDeliveryDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setIsUpdateModalOpen(false)}
                variant="outline"
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                onClick={updateOrderStatus}
                disabled={newDeliveryStatus && !newDeliveryDate}
              >
                {newDeliveryStatus
                  ? "Mark as Delivered"
                  : "Mark as Undelivered"}
              </Button>
            </div>
          </div>
        </div>
      )}
      {isDeleteModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Delete Order</h2>
            <p>
              Are you sure you want to delete order {selectedOrder.cardNumber}?
            </p>
            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setIsDeleteModalOpen(false)}
                variant="outline"
                className="mr-2"
              >
                Cancel
              </Button>
              <Button onClick={handleDeleteOrder} variant="destructive">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
