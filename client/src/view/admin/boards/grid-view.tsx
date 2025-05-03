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

import { EllipsisVertical, MenuIcon, Pen, Trash2 } from "lucide-react";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/hooks/use-loading";

const BoardRow = ({
  board,
  form,
  setEditData,
  toggleAddBoardForm,
}: BoardRowProps) => {
  const { apiClient } = useAuth();
  const { setBoards } = useData();
  const deleting = useLoading();

  const deleteHandler = (id: string) => {
    deleting.asyncWrapper(async () => {
      await apiClient.delete(`/api/board/${id}`);
      toast("Board deleted successfully");
      setBoards((prev) => prev.filter((board) => board.id !== id));
    });
  };

  return (
    <div
      className="bg-secondary px-5 py-3 rounded-sm flex flex-col"
      key={board.id}
    >
      <div className="flex justify-between items-center">
        <Link
          href={`/admin/exam?board=${board.id}`}
          className="text-xl font-bold"
        >
          {board.name} ({board.enrollmentCount})
        </Link>
        <Menubar className="bg-transparent border-0 p-0">
          <MenubarMenu>
            <MenubarTrigger className="p-0">
              <EllipsisVertical />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem
                onClick={() => {
                  setEditData(board);
                  form.setValue("name", board.name);
                  form.setValue("description", board.description);
                  toggleAddBoardForm();
                }}
              >
                Edit{" "}
                <MenubarShortcut>
                  <Pen />
                </MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem
                onClick={() => {
                  deleteHandler(board.id);
                }}
              >
                {deleting.loader || "Delete"}
                <MenubarShortcut>
                  <Trash2 className="text-red-400" />
                </MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      <p className="text-xs opacity-60">{board.description}</p>
    </div>
  );
};

export default function BoardsGridView({
  form,
  setEditData,
  toggleAddBoardForm,
}: Props) {
  const { boards } = useData();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
      {boards.map((board) => {
        return (
          <BoardRow
            key={board.id}
            board={board}
            form={form}
            setEditData={setEditData}
            toggleAddBoardForm={toggleAddBoardForm}
          />
        );
      })}
    </div>
  );
}

type Props = {
  form: any;
  setEditData: (data: Board) => void;
  toggleAddBoardForm: () => void;
};

interface BoardRowProps extends Props {
  board: Board;
}
