"use client";

import { useAuth } from "@/context/AuthContext";
import Navbar from "@/view/layout/navbar";
import { usePathname, useRouter } from "next/navigation";
import React, { PropsWithChildren, useEffect } from "react";

export default function AdminLayout({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth();

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?from=" + pathname);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }
  return (
    <Navbar>
      <div className="px-[5%]">{children}</div>
    </Navbar>
  );
}
