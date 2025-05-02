"use client";

import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { AxiosError } from "axios";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSearchParams } from "next/navigation";

import ExamForm from "./exam-form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ExamGridView from "./grid-view";
import ExamTableView from "./table-view";
import ExamCategory from "./exam-category";

export const ExamFormSchema = z.object({
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
  examDate: z.date(),
  boardId: z.string().uuid(),
});

const ClientExamsPage = () => {
  const { apiClient } = useAuth();
  const { boards, setExams, exams } = useData();
  const [editData, setEditData] = useState<null | Exam>(null);
  const [showAddBoardForm, setShowAddBoardForm] = useState(false);
  const [gridView, setGridView] = useState(false);

  const [selectedRow, setSelectedRow] = useState<Exam | null>(null);

  const searchParams = useSearchParams();

  const toggleExamForm = () => setShowAddBoardForm((prev) => !prev);

  const form = useForm<z.infer<typeof ExamFormSchema>>({
    resolver: zodResolver(ExamFormSchema),
    defaultValues: {
      description: "",
      name: "",
      examDate: new Date(),
    },
  });

  useEffect(() => {
    if ([].length === 0) {
      (async () => {
        try {
          const board = searchParams.get("board");
          const { data } = await apiClient.get("/api/exam", {
            params: {
              ...(board ? { boardId: board } : {}),
            },
          });
          setExams(data.data);
        } catch (error) {
          if (error instanceof AxiosError)
            toast(error.response?.data?.message || "Something went wrong");
        }
      })();
    }
  }, []);

  const boardsMap = useMemo(() => {
    return boards.reduce((prev, curr) => {
      prev[curr.id] = curr;
      return prev;
    }, {} as { [key: string]: Board });
  }, [boards]);

  return (
    <div>
      <div className="flex justify-between items-center pt-3">
        <h2>Exams</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={gridView}
              onCheckedChange={setGridView}
              id="grid-view"
            />
            <Label htmlFor="grid-view">Grid view</Label>
          </div>
          <ExamForm
            editData={editData}
            form={form}
            setEditData={setEditData}
            showAddBoardForm={showAddBoardForm}
            toggleExamForm={toggleExamForm}
          />
        </div>
      </div>
      {exams.length === 0 && (
        <p className="flex justify-center my-1">No data</p>
      )}
      {gridView && (
        <ExamGridView
          boardsMap={boardsMap}
          form={form}
          setEditData={setEditData}
          toggleExamForm={toggleExamForm}
        />
      )}
      {!gridView && (
        <ExamTableView
          boardsMap={boardsMap}
          form={form}
          setEditData={setEditData}
          toggleExamForm={toggleExamForm}
          setSelectedRow={setSelectedRow}
        />
      )}
      <ExamCategory
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        exam={selectedRow}
        setEditData={setEditData}
      />
    </div>
  );
};

export default ClientExamsPage;
