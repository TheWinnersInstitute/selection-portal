"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function LoginServer() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated) router.push("/admin/student");
  }, [isAuthenticated]);

  const loginHandler = async () => {
    try {
      if (!emailRef.current || !passwordRef.current) {
        toast("Inputs not found");
        return;
      }

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`,
        {
          email: emailRef.current.value || "",
          password: passwordRef.current.value || "",
        }
      );
      localStorage.setItem("__session", JSON.stringify(data.data[0]));
      login(data.data[0]);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast(error.response?.data?.message || "Something went wrong");
        console.log(error.response?.data);
      }
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="mt-5 w-[80%] md:w-[50%] lg:w-[40%]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          {/* <CardDescription>
            Register if you don&apos;t have an account.
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-3 w-full">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                ref={emailRef}
                id="email"
                type="email"
                placeholder="Enter email"
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                ref={passwordRef}
                className="w-full"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showPassword"
                  onCheckedChange={(v) => setShowPassword((prev) => !prev)}
                />
                <label
                  htmlFor="showPassword"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Show password
                </label>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={loginHandler}>Login</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
