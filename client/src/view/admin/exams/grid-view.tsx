import React from "react";
import Link from "next/link";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { EllipsisVertical, Pen, Trash2 } from "lucide-react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/hooks/use-loading";
import { toast } from "sonner";

const ExamRow = ({
  exam,
  setEditData,
  toggleExamForm,
  form,
  index,
  boardsMap,
}: ExamRowProps) => {
  const { apiClient } = useAuth();
  const { setExams } = useData();
  const deleting = useLoading();

  const deleteHandler = (id: string) => {
    deleting.asyncWrapper(async () => {
      await apiClient.delete(`/api/exam/${id}`);
      toast("Exam deleted successfully");
      setExams((prev) => prev.filter((exam) => exam.id !== id));
    });
  };

  return (
    <div
      className="bg-secondary px-5 py-3 min-h-28 rounded-sm flex-1 flex flex-col"
      key={exam.id}
    >
      <div className="flex justify-between items-center">
        <Link
          href={`/admin/student?examId=${exam.id}`}
          className="text-md font-bold"
        >
          {exam.name} ({exam.enrollmentCount})
        </Link>
        <Menubar className="bg-transparent border-0 p-0">
          <MenubarMenu>
            <MenubarTrigger className="p-0">
              <EllipsisVertical />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem
                onClick={() => {
                  setEditData(exam);
                  form.setValue("name", exam.name);
                  form.setValue("description", exam.description);
                  form.setValue("boardId", exam.boardId);
                  form.setValue("examDate", new Date(exam.examDate));
                  toggleExamForm();
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
                  deleteHandler(exam.id);
                }}
              >
                Delete
                <MenubarShortcut>
                  <Trash2 className="text-red-400" />
                </MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      <p className="text-sm">{boardsMap[exam.boardId]?.name}</p>
      <p className="text-xs opacity-60">{exam.description}</p>
      <div className="flex-1"></div>
    </div>
  );
};

export default function ExamGridView({
  boardsMap,
  form,
  setEditData,
  toggleExamForm,
}: Props) {
  const { exams } = useData();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
      {exams.map((exam, index) => {
        return (
          <ExamRow
            key={exam.id}
            exam={exam}
            index={index}
            setEditData={setEditData}
            form={form}
            toggleExamForm={toggleExamForm}
            boardsMap={boardsMap}
          />
        );
      })}
    </div>
  );
}

type Props = {
  boardsMap: {
    [key: string]: Board;
  };
  setEditData: (data: Exam | null) => void;
  form: any;
  toggleExamForm: () => void;
};

interface ExamRowProps extends Props {
  index: number;
  exam: Exam;
}
