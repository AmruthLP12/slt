"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { addOrder } from "@/app/handler/orderHandlers";

const itemArray = [
  { id: 1, name: "Jig Jag Falls" },
  { id: 2, name: "Blouse" },
  { id: 3, name: "Dress" },
  { id: 4, name: "Saree kuch" },
  { id: 5, name: "Gown" },
  { id: 6, name: "Others" },
];

interface InvoiceItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface FormErrors {
  cardNumber: string;
  currentDate: string;
  deliveryDate: string;
}

export default function InvoiceComponent() {
  const router = useRouter();
  const { toast } = useToast();

  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [advance, setAdvance] = useState<number | string>("");
  const [errors, setErrors] = useState<FormErrors>({
    cardNumber: "",
    currentDate: "",
    deliveryDate: "",
  });

  const addItem = (afterId?: number) => {
    const newItem = { id: Date.now(), name: "", quantity: 1, price: 0 };
    if (afterId) {
      const index = items.findIndex((item) => item.id === afterId);
      setItems([
        ...items.slice(0, index + 1),
        newItem,
        ...items.slice(index + 1),
      ]);
    } else {
      setItems([...items, newItem]);
    }
  };

  const deleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const calculateTotal = (item: InvoiceItem) => {
    const quantity = parseFloat(item.quantity.toString()) || 0;
    const price = parseFloat(item.price.toString()) || 0;
    return quantity * price;
  };

  const grandTotal = items.reduce((sum, item) => sum + calculateTotal(item), 0);
  const remainingTotal = grandTotal - (parseFloat(advance.toString()) || 0);

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: FormErrors = {
      cardNumber: "",
      currentDate: "",
      deliveryDate: "",
    };

    if (!cardNumber) {
      newErrors.cardNumber = "Card number is required";
      isValid = false;
    }

    if (!currentDate) {
      newErrors.currentDate = "Current date is required";
      isValid = false;
    }

    if (!deliveryDate) {
      newErrors.deliveryDate = "Delivery date is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleReset = () => {
    setCustomerName("");
    setPhoneNumber("");
    setCardNumber("");
    setCurrentDate("");
    setDeliveryDate("");
    setItems([]);
    setAdvance("");
    setErrors({
      cardNumber: "",
      currentDate: "",
      deliveryDate: "",
    });
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const order = await addOrder({
          customerName,
          phoneNumber,
          cardNumber,
          currentDate: new Date(currentDate),
          deliveryDate: new Date(deliveryDate),
          advance: parseFloat(advance.toString()) || 0,
          grandTotal,
          remainingTotal,
          items,
        });

        const result = await order.json();

        if (result.message === "Order created") {
          toast({
            title: "Success",
            description: "Order created successfully",
          });
          handleReset();
        } else {
          toast({
            title: "Error",
            description: result.message,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Invoice</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="customerName">Customer Name</Label>
          <Input
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className={errors.cardNumber ? "border-red-500" : ""}
          />
          {errors.cardNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
          )}
        </div>
        <div>
          <Label htmlFor="currentDate">Current Date</Label>
          <Input
            id="currentDate"
            type="date"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
            className={errors.currentDate ? "border-red-500" : ""}
          />
          {errors.currentDate && (
            <p className="text-red-500 text-sm mt-1">{errors.currentDate}</p>
          )}
        </div>
        <div>
          <Label htmlFor="deliveryDate">Delivery Date</Label>
          <Input
            id="deliveryDate"
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className={errors.deliveryDate ? "border-red-500" : ""}
          />
          {errors.deliveryDate && (
            <p className="text-red-500 text-sm mt-1">{errors.deliveryDate}</p>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Item Name</TableHead>
              <TableHead className="w-20">Quantity</TableHead>
              <TableHead className="w-24">Price</TableHead>
              <TableHead className="w-1/4">Total</TableHead>
              <TableHead className="w-24">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Select
                    onValueChange={(value) =>
                      updateItem(item.id, "name", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an item" />
                    </SelectTrigger>
                    <SelectContent>
                      {itemArray.map((option) => (
                        <SelectItem key={option.id} value={option.name}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, "quantity", e.target.value)
                    }
                    min="1"
                    className="w-20"
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      updateItem(item.id, "price", e.target.value)
                    }
                    min="0"
                    step="0.01"
                    className="w-24"
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                </TableCell>
                <TableCell>{calculateTotal(item).toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => addItem(item.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {items.length === 0 && (
        <Button onClick={() => addItem()} className="mt-4">
          <Plus className="mr-2 h-4 w-4" /> Add First Item
        </Button>
      )}

      <div className="mt-6 space-y-2 lg:flex lg:justify-between lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-4">
          <span>Grand Total:</span>
          <span className="font-bold">{grandTotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Advance:</span>
          <Input
            type="number"
            value={advance}
            onChange={(e) => setAdvance(e.target.value)}
            className="w-32"
            min="0"
            step="0.01"
            onWheel={(e) => e.currentTarget.blur()}
          />
        </div>
        <div className="flex items-center space-x-4">
          <span>Remaining Total:</span>
          <span className="font-bold">{remainingTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button onClick={handleSubmit}>Submit</Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button variant="secondary" onClick={handlePrint}>
          Print
        </Button>
      </div>
    </div>
  );
}
