import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  EllipsisVertical,
  ImageIcon,
  ListStart,
  Pen,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/hooks/use-loading";
import { toast } from "sonner";
import { format } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import { BannerFormType } from "./form";
import { useRouter } from "next/navigation";
import { useModel } from "@/hooks/use-model";

function BannerCard({
  setEditData,
  form,
  toggleBannerForm,
  banner,
  setBanners,
}: BoardRowProps) {
  const router = useRouter();
  const { apiClient } = useAuth();
  const deleteConfirmationModel = useModel(
    "Are you sure you want to delete this lucky draw ??"
  );

  const deleteHandler = async () => {
    await apiClient.delete(`/api/banner/${banner.id}`);
    toast("Lucky draw deleted successfully");
    setBanners((prev) => prev.filter((ld) => ld.id !== banner.id));
  };

  return (
    <div
      onClick={() => {
        if (banner.link) {
          window.open(banner.link);
        }
      }}
      className="bg-secondary cursor-pointer relative rounded-md w-full md:w-[32%] lg:w-[24%]"
    >
      {banner?.imageId ? (
        <img
          // width={500}
          // height={500}
          className="w-full h-auto rounded-t-md"
          alt={banner.id}
          src={`${process.env.NEXT_PUBLIC_API_URL}/api/admin/assets/${banner?.imageId}?_cache=true`}
        />
      ) : (
        <div className="w-full h-26 flex justify-center items-center">
          <ImageIcon size={70} className="opacity-40" />
        </div>
      )}
      <div className="px-2 py-3">
        <p className="font-semibold text-md lg:text-xl"> {banner.name}</p>
      </div>
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-3 right-3"
      >
        <Menubar className="bg-transparent border-0 p-0">
          <MenubarMenu>
            <MenubarTrigger className="p-0 bg-[#00000050]">
              <EllipsisVertical />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem
                onClick={() => {
                  setEditData(banner);
                  form.setValue("name", banner.name);
                  form.setValue("sequence", banner.sequence.toString());
                  if (banner.link) form.setValue("link", banner.link);
                  toggleBannerForm();
                }}
              >
                Edit{" "}
                <MenubarShortcut>
                  <Pen />
                </MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={deleteConfirmationModel.toggleModel}>
                Delete
                <MenubarShortcut>
                  <Trash2 className="text-red-400" />
                </MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        {deleteConfirmationModel.confirmationModel("Delete", deleteHandler)}
      </div>
    </div>
  );
}

export default function BannerTable({
  form,
  setEditData,
  toggleBannerForm,
  banners,
  setBanners,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {banners.map((banner) => {
        return (
          <BannerCard
            key={banner.id}
            form={form}
            setBanners={setBanners}
            banner={banner}
            banners={banners}
            setEditData={setEditData}
            toggleBannerForm={toggleBannerForm}
          />
        );
      })}
    </div>
  );
}

type Props = {
  form: UseFormReturn<BannerFormType, any, BannerFormType>;
  setEditData: (data: Banner) => void;
  toggleBannerForm: () => void;
  banners: Banner[];
  setBanners: React.Dispatch<React.SetStateAction<Banner[]>>;
};

interface BoardRowProps extends Props {
  banner: Banner;
}
