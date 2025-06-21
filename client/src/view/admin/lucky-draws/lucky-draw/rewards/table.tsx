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
import { EllipsisVertical, ImageIcon, Pen, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/hooks/use-loading";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { LuckyDrawRewardFormType } from "./form";
import { Button } from "@/components/ui/button";
import { useModel } from "@/hooks/use-model";

function LuckyDrawRewardCard({
  setEditData,
  form,
  luckyDrawReward,
  setLuckyDrawRewards,
  toggleLuckyDrawRewardForm,
}: RowProps) {
  const { apiClient } = useAuth();

  const deleteConfirmationModel = useModel(
    "Are you sure you want to delete this reward ??"
  );

  const deleteHandler = async () => {
    await apiClient.delete(
      `/api/lucky-draw/reward/${luckyDrawReward.luckyDrawId}/${luckyDrawReward.id}`
    );
    toast("Lucky draw deleted reward successfully");
    setLuckyDrawRewards((prev) =>
      prev.filter((ld) => ld.id !== luckyDrawReward.id)
    );
  };

  return (
    <div className="bg-secondary cursor-pointer relative rounded-md w-full md:w-[32%] lg:w-[24%]">
      {luckyDrawReward?.assetId ? (
        <img
          className="w-full h-auto rounded-t-md"
          alt={luckyDrawReward.id}
          src={`${process.env.NEXT_PUBLIC_API_URL}/api/admin/assets/${luckyDrawReward?.assetId}`}
        />
      ) : (
        <div className="w-full h-26 flex justify-center items-center">
          <ImageIcon size={70} className="opacity-40" />
        </div>
      )}
      <div className="px-2 py-3">
        <p className="font-semibold text-md lg:text-xl">
          {" "}
          {luckyDrawReward.name}
        </p>
        <p className="text-xs mt-2">{luckyDrawReward.count}</p>
      </div>
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-3 right-3"
      >
        <Menubar className="bg-transparent border-0 p-0">
          <MenubarMenu>
            <MenubarTrigger className="p-0 bg-[#00000050]">
              <EllipsisVertical className="text-xs" />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem
                onClick={() => {
                  setEditData(luckyDrawReward);
                  form.setValue("name", luckyDrawReward.name);
                  form.setValue("count", luckyDrawReward.count);
                  toggleLuckyDrawRewardForm();
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
      </div>
      {deleteConfirmationModel.confirmationModel("Delete", deleteHandler)}
    </div>
  );
}

export default function LuckyDrawRewardsTable({
  form,
  setEditData,
  luckyDrawRewards,
  setLuckyDrawRewards,
  toggleLuckyDrawRewardForm,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {luckyDrawRewards.map((luckyDrawReward) => {
        return (
          <LuckyDrawRewardCard
            form={form}
            key={luckyDrawReward.id}
            setEditData={setEditData}
            luckyDrawReward={luckyDrawReward}
            luckyDrawRewards={luckyDrawRewards}
            setLuckyDrawRewards={setLuckyDrawRewards}
            toggleLuckyDrawRewardForm={toggleLuckyDrawRewardForm}
          />
        );
      })}
    </div>
  );
}

type Props = {
  form: UseFormReturn<LuckyDrawRewardFormType, any, LuckyDrawRewardFormType>;
  setEditData: (data: LuckyDrawReward) => void;
  toggleLuckyDrawRewardForm: () => void;
  luckyDrawRewards: LuckyDrawReward[];
  setLuckyDrawRewards: React.Dispatch<React.SetStateAction<LuckyDrawReward[]>>;
};

interface RowProps extends Props {
  luckyDrawReward: LuckyDrawReward;
}
