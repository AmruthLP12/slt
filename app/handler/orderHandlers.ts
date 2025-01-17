interface Item {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface AddOrderFields {
  customerName?: string;
  phoneNumber?: string;
  cardNumber: string;
  currentDate: Date;
  deliveryDate: Date;
  advance?: number;
  grandTotal: number;
  remainingTotal: number;
  items: Item[];
}

const addOrder = async (orderFields: AddOrderFields): Promise<any> => {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderFields),
    });

    if (!response.ok) {
      throw new Error(`Failed to add order: ${response.statusText}`);
    }

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error adding order:", error.message);
      return { message: "Error adding order", error: error.message };
    }

    console.error("Unknown error:", error);
    return { message: "Unknown error", error: String(error) };
  }
};

export { addOrder };
