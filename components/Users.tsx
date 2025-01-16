'use client'

import { getUsers, updateUser, deleteUser } from "@/app/handler/userHandlers";
import { User, ROLES, Role } from "@/types/userTypes";
import { useEffect, useState } from "react";
import { Modal } from "./modal";
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
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<Partial<User>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{isOpen: boolean, userId: string | null, userName: string | null}>({
    isOpen: false,
    userId: null,
    userName: null,
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data.users);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        });
      }
    };

    fetchUsers();
  }, [toast]);

  const handleEdit = (user: User) => {
    setEditUser(user);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (editUser._id) {
      const updatedFields = {
        name: editUser.name || "",
        email: editUser.email || "",
        role: editUser.role || "",
      };

      try {
        const result = await updateUser(editUser._id, updatedFields);
        if (result.message === "User updated") {
          setUsers(
            users.map((user) =>
              user._id === editUser._id ? { ...user, ...updatedFields } : user
            )
          );
          setEditUser({});
          setIsModalOpen(false);
          toast({
            title: "Success",
            description: "User updated successfully",
          });
        } else {
          throw new Error(result.error || "Failed to update user");
        }
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to update user",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteConfirmation = (user: User) => {
    setDeleteConfirmation({ isOpen: true, userId: user._id, userName: user.name });
  };

  const handleDelete = async () => {
    if (deleteConfirmation.userId) {
      try {
        const result = await deleteUser(deleteConfirmation.userId);
        if (result.message === "User deleted") {
          setUsers(users.filter(user => user._id !== deleteConfirmation.userId));
          toast({
            title: "Success",
            description: "User deleted successfully",
          });
        } else {
          throw new Error(result.error || "Failed to delete user");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to delete user",
          variant: "destructive",
        });
      } finally {
        setDeleteConfirmation({ isOpen: false, userId: null, userName: null });
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user._id} className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
            <p className="text-gray-600 mb-1">{user.email}</p>
            <p className="text-gray-600 mb-3">{user.role}</p>
            <div className="flex space-x-2">
              <Button onClick={() => handleEdit(user)}>Edit</Button>
              <Button variant="destructive" onClick={() => handleDeleteConfirmation(user)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit User"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={editUser.name || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, name: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={editUser.email || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select
              value={editUser.role}
              onValueChange={(value: Role) =>
                setEditUser({ ...editUser, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update User</Button>
          </div>
        </div>
      </Modal>

      <Dialog open={deleteConfirmation.isOpen} onOpenChange={(isOpen) => setDeleteConfirmation({ ...deleteConfirmation, isOpen })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this user : {deleteConfirmation.userName}</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to delete user "{deleteConfirmation.userName}" and permanently remove their data from our servers?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmation({ isOpen: false, userId: null, userName: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
