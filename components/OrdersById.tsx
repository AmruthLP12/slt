"use client";

import { getOrderByID } from "@/app/handler/orderHandlers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { Printer, CheckCircle, Truck } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface InvoiceDetails {
  cardNumber: string;
  customerName: string;
  phoneNumber: string;
  currentDate: string;
  deliveryDate: string;
  isDelivered: boolean;
  deliveredDate?: string;
  items: InvoiceItem[];
  grandTotal: number;
  advance: number;
  remainingTotal: number;
}

const OrderById = () => {
  const { orderId } = useParams();
  const [invoice, setInvoice] = useState<InvoiceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderById = async () => {
      setIsLoading(true);
      try {
        const order = await getOrderByID(orderId as string);
        if (!order) {
          throw new Error("Order not found");
        }
        setInvoice(order);
      } catch (error) {
        console.error("Failed to fetch order:", error);
        setInvoice(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrderById();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <Card className="max-w-5xl mx-auto my-8 p-6">
        <SkeletonLoader />
      </Card>
    );
  }

  if (!invoice) {
    return (
      <Card className="max-w-5xl mx-auto my-8 p-6">
        <CardContent>
          <p className="text-center text-lg">Order not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-5xl mx-auto my-8 p-6 print:shadow-none dark:bg-gray-800 dark:text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-3xl font-bold">Invoice Details</CardTitle>
        <Button onClick={handlePrint} className="print:hidden">
          <Printer className="mr-2 h-4 w-4" />
          Print Invoice
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <InfoItem label="Card Number" value={invoice.cardNumber} />
          <InfoItem label="Customer Name" value={invoice.customerName} />
          <InfoItem label="Phone Number" value={invoice.phoneNumber} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <InfoItem
            label="Order Date"
            value={format(new Date(invoice.currentDate), 'dd/MM/yyyy')}
          />
          <DeliveryStatus
            isDelivered={invoice.isDelivered}
            deliveryDate={invoice.deliveryDate}
            deliveredDate={invoice.deliveredDate}
          />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Order Items</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">
                    {item.quantity || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    ₹{(item.price || 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    ₹{(item.total || 0).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-lg">
          <InfoItem
            label="Total Amount"
            value={`₹${(invoice.grandTotal || 0).toFixed(2)}`}
          />
          <InfoItem
            label="Advance"
            value={`₹${(invoice.advance || 0).toFixed(2)}`}
          />
          <InfoItem
            label="Remaining Amount"
            value={`₹${(invoice.remainingTotal || 0).toFixed(2)}`}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) => (
  <div className="space-y-1">
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p className="text-lg font-semibold">
      {typeof value === "number" ? value.toFixed(2) : value || "N/A"}
    </p>
  </div>
);

const DeliveryStatus = ({
  isDelivered,
  deliveryDate,
  deliveredDate,
}: {
  isDelivered: boolean;
  deliveryDate: string;
  deliveredDate?: string;
}) => (
  <div className="space-y-1">
    <p className="text-sm font-medium text-muted-foreground">Delivery Status</p>
    <div className="flex items-center space-x-2">
      {isDelivered ? (
        <>
          <CheckCircle className="h-5 w-5 text-green-500" />
          <Badge variant="success">Delivered</Badge>
        </>
      ) : (
        <>
          <Truck className="h-5 w-5 text-blue-500" />
          <Badge variant="secondary">In Transit</Badge>
        </>
      )}
    </div>
    <p className="text-sm">
      {isDelivered
        ? `Delivered on ${format(new Date(deliveredDate || ''), 'dd/MM/yyyy')} (Expected: ${format(new Date(deliveryDate), 'dd/MM/yyyy')})`
        : `Expected delivery on ${format(new Date(deliveryDate), 'dd/MM/yyyy')}`
      }
    </p>
  </div>
);

export default OrderById;

