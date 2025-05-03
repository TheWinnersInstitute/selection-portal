import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { EllipsisVertical, MenuIcon, Pen, Trash2 } from "lucide-react";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/hooks/use-loading";
import { Button } from "@/components/ui/button";

const BoardRow = ({
  board,
  form,
  setEditData,
  toggleAddBoardForm,
  index,
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
    <TableRow key={board.id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        {board.name} ({board.enrollmentCount || 0})
      </TableCell>
      <TableCell>
        {board.description.length > 40
          ? `${board.description.slice(0, 40)}...`
          : board.description}
      </TableCell>
      <TableCell className="space-x-2">
        <Button
          variant="ghost"
          onClick={() => {
            setEditData(board);
            form.setValue("name", board.name);
            form.setValue("description", board.description);
            toggleAddBoardForm();
          }}
          size="icon"
        >
          <Pen />
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            deleteHandler(board.id);
          }}
          size="icon"
        >
          {deleting.loader || <Trash2 className="text-red-400" />}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default function BoardsTableView({
  form,
  setEditData,
  toggleAddBoardForm,
}: Props) {
  const { boards } = useData();

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>S.No.</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {boards.map((board, index) => (
          <BoardRow
            key={board.id}
            board={board}
            index={index}
            form={form}
            setEditData={setEditData}
            toggleAddBoardForm={toggleAddBoardForm}
          />
        ))}
      </TableBody>
    </Table>
  );
}

type Props = {
  form: any;
  setEditData: (data: Board) => void;
  toggleAddBoardForm: () => void;
};

interface BoardRowProps extends Props {
  board: Board;
  index: number;
}
