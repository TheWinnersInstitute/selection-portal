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
import { LuckyDrawFormType } from "./form";
import { useRouter } from "next/navigation";
import { useModel } from "@/hooks/use-model";

function LuckyDrawCard({
  setEditData,
  form,
  toggleLuckyDrawForm,
  luckyDraw,
  setLuckyDraws,
}: BoardRowProps) {
  const router = useRouter();
  const { apiClient } = useAuth();
  const deleteConfirmationModel = useModel(
    "Are you sure you want to delete this lucky draw ??"
  );

  const deleteHandler = async () => {
    await apiClient.delete(`/api/lucky-draw/${luckyDraw.id}`);
    toast("Lucky draw deleted successfully");
    setLuckyDraws((prev) => prev.filter((ld) => ld.id !== luckyDraw.id));
  };

  return (
    <div
      onClick={() => {
        router.push(`/admin/lucky-draw/${luckyDraw.id}`);
      }}
      className="bg-secondary cursor-pointer relative rounded-md w-full md:w-[32%] lg:w-[24%]"
    >
      {luckyDraw?.bannerId ? (
        <img
          // width={500}
          // height={500}
          className="w-full h-auto rounded-t-md"
          alt={luckyDraw.id}
          src={`${process.env.NEXT_PUBLIC_API_URL}/api/admin/assets/${luckyDraw?.bannerId}`}
        />
      ) : (
        <div className="w-full h-26 flex justify-center items-center">
          <ImageIcon size={70} className="opacity-40" />
        </div>
      )}
      <div className="px-2 py-3">
        <p className="font-semibold text-md lg:text-xl"> {luckyDraw.name}</p>
        <p className="text-xs mt-2">
          <span className="font-bold">Opening date:</span>{" "}
          {format(luckyDraw.openingDate, "PPP p")}
        </p>
        <p className="text-xs">
          <span className="font-bold">Participation end date:</span>
          {format(luckyDraw.participationEndDate, "PPP p")}
        </p>
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
                  router.push(`/${luckyDraw.id}`);
                }}
              >
                Start
                <MenubarShortcut>
                  <ListStart />
                </MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem
                onClick={() => {
                  setEditData(luckyDraw);
                  form.setValue("name", luckyDraw.name);
                  form.setValue("openingDate", new Date(luckyDraw.openingDate));
                  form.setValue(
                    "participationEndDate",
                    new Date(luckyDraw.participationEndDate)
                  );
                  toggleLuckyDrawForm();
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

export default function LuckyDrawTable({
  form,
  setEditData,
  toggleLuckyDrawForm,
  luckyDraws,
  setLuckyDraws,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {luckyDraws.map((luckyDraw) => {
        return (
          <LuckyDrawCard
            key={luckyDraw.id}
            form={form}
            setLuckyDraws={setLuckyDraws}
            luckyDraw={luckyDraw}
            luckyDraws={luckyDraws}
            setEditData={setEditData}
            toggleLuckyDrawForm={toggleLuckyDrawForm}
          />
        );
      })}
    </div>
  );
}

type Props = {
  form: UseFormReturn<LuckyDrawFormType, any, LuckyDrawFormType>;
  setEditData: (data: LuckyDraw) => void;
  toggleLuckyDrawForm: () => void;
  luckyDraws: LuckyDraw[];
  setLuckyDraws: React.Dispatch<React.SetStateAction<LuckyDraw[]>>;
};

interface BoardRowProps extends Props {
  luckyDraw: LuckyDraw;
}
