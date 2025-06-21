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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EllipsisVertical, ImageIcon, Pen, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/hooks/use-loading";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { LuckyDrawParticipantFormType } from "./form";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useModel } from "@/hooks/use-model";

function LuckyDrawParticipantRow({
  setEditData,
  form,
  participant,
  setLuckyDrawParticipants,
  toggleLuckyDrawParticipantForm,
  index,
}: RowProps) {
  const { apiClient } = useAuth();
  const params = useParams();
  const deleteConfirmationModel = useModel(
    "Are you sure you want to delete this participant ??"
  );

  const deleteHandler = async () => {
    await apiClient.delete(
      `/api/lucky-draw/participant/${params.luckyDrawId}/${participant.id}`
    );
    toast("Lucky draw participant deleted successfully");
    setLuckyDrawParticipants((prev) =>
      prev.filter((ld) => ld.id !== participant.id)
    );
  };
  return (
    <TableRow key={participant.id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{participant.name}</TableCell>
      <TableCell>{participant.phone}</TableCell>
      <TableCell>{participant.email}</TableCell>
      <TableCell onClick={(e) => e.stopPropagation()} className="space-x-1">
        <Menubar className="bg-transparent border-0 p-0">
          <MenubarMenu>
            <MenubarTrigger className="p-0">
              <EllipsisVertical className="text-xs" />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem
                onClick={() => {
                  setEditData(participant);
                  form.setValue("name", participant.name);
                  form.setValue("phone", participant.phone);
                  form.setValue("email", participant.email);
                  toggleLuckyDrawParticipantForm();
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
      </TableCell>
    </TableRow>
  );
}

export default function LuckyDrawParticipantsTable({
  form,
  setEditData,
  participants,
  setLuckyDrawParticipants,
  toggleLuckyDrawParticipantForm,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <Table>
        <TableCaption>A list of exams.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>S.No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map((participant, index) => (
            <LuckyDrawParticipantRow
              key={participant.id}
              form={form}
              index={index}
              participant={participant}
              participants={participants}
              setEditData={setEditData}
              setLuckyDrawParticipants={setLuckyDrawParticipants}
              toggleLuckyDrawParticipantForm={toggleLuckyDrawParticipantForm}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

type Props = {
  form: UseFormReturn<
    LuckyDrawParticipantFormType,
    any,
    LuckyDrawParticipantFormType
  >;
  setEditData: (data: LuckyDrawParticipant) => void;
  toggleLuckyDrawParticipantForm: () => void;
  participants: LuckyDrawParticipant[];
  setLuckyDrawParticipants: React.Dispatch<
    React.SetStateAction<LuckyDrawParticipant[]>
  >;
};

interface RowProps extends Props {
  participant: LuckyDrawParticipant;
  index: number;
}
