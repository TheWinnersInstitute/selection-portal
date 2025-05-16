"use client";

import AdminStudentsPage from "@/view/admin/students";
import React, { Suspense } from "react";

export default function ServerAdminStudentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center my-5">Loading...</div>
      }
    >
      <AdminStudentsPage />
    </Suspense>
  );
}
