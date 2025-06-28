"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import React, { PropsWithChildren } from "react";

export default function MainLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  return (
    <div>
      {/* <div className="flex justify-between items-center gap-3 pt-3 mb-3">
        <Tabs>
          <TabsList>
            <TabsTrigger
              onClick={() => router.push("/admin/main/banner")}
              value="banner"
            >
              Banner
            </TabsTrigger>
          
          </TabsList>
        </Tabs>
      </div> */}
      {children}
    </div>
  );
}
