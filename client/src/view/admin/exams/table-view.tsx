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
import { Button } from "@/components/ui/button";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useLoading } from "@/hooks/use-loading";
import { Pen, Trash2 } from "lucide-react";
import { set } from "lodash";

const ExamRow = ({
  exam,
  setEditData,
  toggleExamForm,
  form,
  index,
  boardsMap,
  setSelectedRow,
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
    <TableRow onClick={() => setSelectedRow(exam)} key={exam.id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        {exam.name} ({exam.enrollmentCount})
      </TableCell>
      <TableCell>{boardsMap[exam.boardId]?.name}</TableCell>
      <TableCell>
        {exam.examCategories.map((category) => category.name).join(", ") || "-"}
      </TableCell>
      <TableCell>{exam.description.slice(0, 40) || "-"}</TableCell>
      <TableCell onClick={(e) => e.stopPropagation()} className="space-x-1">
        <Button
          variant="outline"
          onClick={() => {
            setEditData(exam);
            form.setValue("name", exam.name);
            form.setValue("description", exam.description);
            form.setValue("boardId", exam.boardId);
            form.setValue("examDate", new Date(exam.examDate));
            toggleExamForm();
          }}
          size="icon"
        >
          <Pen />
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            deleteHandler(exam.id);
          }}
          size="icon"
        >
          <Trash2 />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default function ExamTableView({
  boardsMap,
  form,
  setEditData,
  toggleExamForm,
  setSelectedRow,
}: Props) {
  const { exams } = useData();

  return (
    <Table>
      <TableCaption>A list of exams.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>S.No.</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Board</TableHead>
          <TableHead>Categories</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exams.map((exam, index) => (
          <ExamRow
            key={exam.id}
            exam={exam}
            index={index}
            setEditData={setEditData}
            form={form}
            toggleExamForm={toggleExamForm}
            boardsMap={boardsMap}
            setSelectedRow={setSelectedRow}
          />
        ))}
      </TableBody>
    </Table>
  );
}

type Props = {
  boardsMap: {
    [key: string]: Board;
  };
  setEditData: (data: Exam | null) => void;
  form: any;
  toggleExamForm: () => void;
  setSelectedRow: (exam: Exam | null) => void;
};

interface ExamRowProps extends Props {
  index: number;
  exam: Exam;
  setSelectedRow: (exam: Exam | null) => void;
}
