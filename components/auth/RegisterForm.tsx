"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/lib/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.message === "User created successfully") {
        toast({
          title: "Success",
          description: "User created successfully",
        });
        router.push("/login");
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
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" type="text" {...register("name")} />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full">
        Register
      </Button>
    </form>
  );
};
