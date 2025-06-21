import LoginClient from "@/view/auth/login";
import React, { Suspense } from "react";

export default function LoginServer() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex justify-center items-center">
          Loading...
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
