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

const getOrders = async (): Promise<any> => {
  try {
    const response = await fetch("/api/orders");

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching orders:", error.message);
      return { message: "Error fetching orders", error: error.message };
    }

    console.error("Unknown error:", error);
    return { message: "Unknown error", error: String(error) };
  }
};

const getOrderByID = async (orderId: string): Promise<any> => {
  try {
    const response = await fetch(`/api/orders/${orderId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching order:", error.message);
      return { message: "Error fetching order", error: error.message };
    }

    console.error("Unknown error:", error);
    return { message: "Unknown error", error: String(error) };
  }
};

const updateOrderIdStatus = async (orderId: string, newDeliveryStatus: boolean,newDeliveryDate: Date | undefined) => {
  try {
    const response = await fetch(`/api/orders/${orderId}`, {
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
      throw new Error(`Failed to update order: ${response.statusText}`);
    }
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating order:", error.message);
      return { message: "Error updating order", error: error.message };
    }

    console.error("Unknown error:", error);
    return { message: "Unknown error", error: String(error) };
  }
};

const deleteOrder = async (orderId: string) => {
  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete order: ${response.statusText}`);
    }

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting order:", error.message);
      return { message: "Error deleting order", error: error.message };
    }

    console.error("Unknown error:", error);
    return { message: "Unknown error", error: String(error) };
  }
}

export { addOrder , getOrders, getOrderByID, updateOrderIdStatus, deleteOrder };
