"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/hooks/use-loading";
import React, { useEffect, useState } from "react";
import LuckyDrawTable from "./table";
import LuckyDrawForm, { LuckyDrawFormSchema, LuckyDrawFormType } from "./form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ClientLuckyDrawPage() {
  const [luckyDraws, setLuckyDraws] = useState<LuckyDraw[]>([]);
  const [editData, setEditData] = useState<null | LuckyDraw>(null);
  const [openLuckyDrawForm, setOpenLuckyDrawForm] = useState(false);

  const form = useForm<LuckyDrawFormType>({
    resolver: zodResolver(LuckyDrawFormSchema),
    defaultValues: {
      name: "",
      openingDate: new Date(),
      participationEndDate: new Date(),
    },
  });

  const { apiClient, isAuthenticated } = useAuth();

  const fetchingLuckyDraws = useLoading();

  useEffect(() => {
    if (isAuthenticated) {
      fetchingLuckyDraws.asyncWrapper(async () => {
        const { data } = await apiClient.get("/api/lucky-draw");
        setLuckyDraws(data.data);
      });
    }
  }, [isAuthenticated]);

  const toggleLuckyDrawForm = () => setOpenLuckyDrawForm((prev) => !prev);

  if (fetchingLuckyDraws.unauthorized) {
    return (
      <div className="flex flex-col items-center justify-center mt-10">
        <h2 className="font-bold opacity-55">
          You are not authorized to access this screen
        </h2>
      </div>
    );
  }
  return (
    <div>
      <div className="flex justify-between items-center gap-3 pt-3 mb-3">
        <h2 className="font-semibold">Lucky draw</h2>
        <Button onClick={toggleLuckyDrawForm}>Add Lucky draw</Button>
      </div>

      <div className="flex justify-center items-center">
        {fetchingLuckyDraws.loader}
      </div>

      {!fetchingLuckyDraws.loading && (
        <LuckyDrawTable
          form={form}
          luckyDraws={luckyDraws}
          setEditData={setEditData}
          toggleLuckyDrawForm={toggleLuckyDrawForm}
          setLuckyDraws={setLuckyDraws}
        />
      )}
      <LuckyDrawForm
        editData={editData}
        setLuckyDraws={setLuckyDraws}
        openLuckyDrawForm={openLuckyDrawForm}
        toggleLuckyDrawForm={toggleLuckyDrawForm}
        setEditData={setEditData}
        form={form}
      />
    </div>
  );
}
