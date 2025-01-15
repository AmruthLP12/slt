// components/auth/LoginForm.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validation/auth";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log("Login Data:", data);
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.message === "Login successful") {
        toast({
          title: "Success",
          description: "Login successful",
        });
        router.push("/dashboard");
      }
      if (!response.ok) {
        return toast({
          title: "Error",
          description: result.message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" {...register("email")} />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      <Label htmlFor="password">Password</Label>
      <Input id="password" type="password" {...register("password")} />
      {errors.password && (
        <p className="text-red-500">{errors.password.message}</p>
      )}
      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
};
