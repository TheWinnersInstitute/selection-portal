"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { PropsWithChildren, useEffect } from "react";

export default function AdminLayout({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }
  return <div>{children}</div>;
}
