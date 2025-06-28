"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/hooks/use-loading";
import React, { useEffect, useState } from "react";
// import BannerTable from "./table";
import BannerForm, { BannerFormSchema, BannerFormType } from "./form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BannerTable from "./table";

export default function ClientBannerPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editData, setEditData] = useState<null | Banner>(null);
  const [openBannerForm, setOpenBannerForm] = useState(false);

  const form = useForm<BannerFormType>({
    resolver: zodResolver(BannerFormSchema),
    defaultValues: {
      name: "",
      link: "",
      sequence: "",
    },
  });

  const { apiClient, isAuthenticated } = useAuth();

  const fetchingBanners = useLoading();

  useEffect(() => {
    if (isAuthenticated) {
      fetchingBanners.asyncWrapper(async () => {
        const { data } = await apiClient.get("/api/banner");
        setBanners(data.data);
      });
    }
  }, [isAuthenticated]);

  const toggleBannerForm = () => setOpenBannerForm((prev) => !prev);

  if (fetchingBanners.unauthorized) {
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
        <h2 className="font-bold text-xl">Banner</h2>
        <Button onClick={toggleBannerForm}>Add banner</Button>
      </div>

      <div className="flex justify-center items-center">
        {fetchingBanners.loader}
      </div>

      {!fetchingBanners.loading && (
        <BannerTable
          form={form}
          banners={banners}
          setEditData={setEditData}
          toggleBannerForm={toggleBannerForm}
          setBanners={setBanners}
        />
      )}
      <BannerForm
        editData={editData}
        setBanners={setBanners}
        openBannerForm={openBannerForm}
        toggleBannerForm={toggleBannerForm}
        setEditData={setEditData}
        form={form}
      />
    </div>
  );
}
