"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { AuthContextProvider } from "@/context/AuthContext";
import { DataContextProvider } from "@/context/DataContext";

export function Provider({
  children,
  ...props
}: React.ComponentProps<typeof ThemeProvider>) {
  return (
    <ThemeProvider {...props}>
      <AuthContextProvider>
        <DataContextProvider>{children}</DataContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  );
}
