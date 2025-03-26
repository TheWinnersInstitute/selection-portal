"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

export default function Register() {
  return (
    <div className="flex justify-center items-center">
      <Card className="mt-5 w-[80%] md:w-[50%] lg:w-[40%]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Login if you already have an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-3 w-full">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter email" />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                className="w-full"
                id="password"
                type="password"
                placeholder="Password"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Register</Button>
          <Button>Login</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
