"use client";

import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { toast } from "sonner";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import BoardForm from "./board-form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import BoardsGridView from "./grid-view";
import BoardsTableView from "./table-view";

export const BoardFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(100, {
      message: "Name should no be more then 100 characters.",
    }),
  description: z
    .string()
    .max(1000, {
      message: "Description should no be more then 1000 characters.",
    })
    .optional(),
});

export default function ClientBoardsPage() {
  const [showAddBoardForm, setShowAddBoardForm] = useState(false);
  const [gridView, setGridView] = useState(false);

  const { boards } = useData();
  const [editData, setEditData] = useState<null | Board>(null);

  const form = useForm<z.infer<typeof BoardFormSchema>>({
    resolver: zodResolver(BoardFormSchema),
    defaultValues: {
      description: "",
      name: "",
    },
  });

  const toggleAddBoardForm = () => setShowAddBoardForm((prev) => !prev);

  return (
    <div>
      <div className="flex justify-between items-center pt-3">
        <h2>Boards</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={gridView}
              onCheckedChange={setGridView}
              id="grid-view"
            />
            <Label htmlFor="grid-view">Grid view</Label>
          </div>
          <BoardForm
            editData={editData}
            form={form}
            showBoardForm={showAddBoardForm}
            setEditData={setEditData}
            toggleBoardForm={toggleAddBoardForm}
          />
        </div>
      </div>
      {boards.length === 0 && (
        <p className="flex justify-center my-1">No data</p>
      )}
      {gridView ? (
        <BoardsGridView
          form={form}
          setEditData={setEditData}
          toggleAddBoardForm={toggleAddBoardForm}
        />
      ) : (
        <BoardsTableView
          form={form}
          setEditData={setEditData}
          toggleAddBoardForm={toggleAddBoardForm}
        />
      )}
    </div>
  );
}
