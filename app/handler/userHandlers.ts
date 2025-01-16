export const getUsers = async () => {
  try {
    const response = await fetch("/api/users");

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching users:", error.message);
      return { message: "Error fetching users", error: error.message };
    }

    // In case the error is not an instance of Error
    console.error("Unknown error:", error);
    return { message: "Unknown error", error: String(error) };
  }
};

interface UpdateUserFields {
  name: string;
  email: string;
  role: string;
}

export const updateUser = async (
  userId: string,
  updateFields: UpdateUserFields
): Promise<any> => {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateFields),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating user:", error.message);
      return { message: "Error updating user", error: error.message };
    }

    console.error("Unknown error:", error);
    return { message: "Unknown error", error: String(error) };
  }
};

export const deleteUser = async (userId: string): Promise<any> => {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete user: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting user:", error.message);
      return { message: "Error deleting user", error: error.message };
    }

    console.error("Unknown error:", error);
    return { message: "Unknown error", error: String(error) };
  }
};
