import React, { useRef, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/hooks/use-loading";
import { toast } from "sonner";
import { useData } from "@/context/DataContext";
import { AxiosError } from "axios";
import { format } from "date-fns";
import EnrollmentsList from "./enrollments/enrollments-list";
import { Download, Pen, Trash2 } from "lucide-react";
import { studentPdf } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useModel } from "@/hooks/use-model";

type Props = {
  student: Student;
  editHandler: (data: Student) => void;
  onClick?: () => void;
  setCurrentStudent: (data: Student | null) => void;
  setStudentsToDelete: React.Dispatch<React.SetStateAction<string[]>>;
};
export default function StudentTableRow({
  student,
  editHandler,
  onClick,
  setCurrentStudent,
  setStudentsToDelete,
}: Props) {
  const nameArray = student.name.split(" ");

  const { setStudents } = useData();
  const { apiClient } = useAuth();

  const deletingStudent = useLoading();
  const downloadingPdf = useLoading();

  const deleteConfirmationModel = useModel(
    "Are you sure you want to delete this student ??"
  );

  const deleteHandler = (id: string) => {
    deletingStudent.asyncWrapper(async () => {
      await apiClient.delete(`/api/student/${id}`);
      toast("Student deleted successfully");
      setStudents((prev) => prev.filter((student) => student.id !== id));
      deleteConfirmationModel.toggleModel();
    });
  };

  const downloadStudentPdf = () => {
    downloadingPdf.asyncWrapper(async () => {
      await studentPdf([student]);
    });
  };

  return (
    <TableRow onClick={onClick}>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <Checkbox
          onCheckedChange={(e) => {
            setStudentsToDelete((prev) => {
              if (e) {
                return [...prev, student.id];
              }
              return prev.filter((id) => id !== student.id);
            });
          }}
        />
      </TableCell>
      <TableCell
        onClick={(e) => {
          e.stopPropagation();
          if (student.imageId) {
            window.open(
              `${process.env.NEXT_PUBLIC_API_URL}/api/admin/assets/${student.imageId}`,
              "_blank",
              "noopener,noreferrer"
            );
          }
        }}
      >
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={`${process.env.NEXT_PUBLIC_API_URL}/api/admin/assets/${student.imageId}`}
            alt={student.id}
          />
          <AvatarFallback>
            {nameArray[0]?.[0]}
            {nameArray[1]?.[0] || ""}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell>{student.name}</TableCell>
      <TableCell>+91 {student.contactNumber}</TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <EnrollmentsList
          student={student}
          setCurrentStudent={setCurrentStudent}
        />
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()} className="space-x-1 ">
        <Button
          variant="outline"
          onClick={() => {
            editHandler(student);
          }}
          size="icon"
        >
          <Pen />
        </Button>
        <Button
          variant="outline"
          onClick={deleteConfirmationModel.toggleModel}
          size="icon"
        >
          <Trash2 />
        </Button>
        <Button variant="outline" onClick={downloadStudentPdf} size="icon">
          {downloadingPdf.loader || <Download />}
        </Button>
      </TableCell>
      {deleteConfirmationModel.content(
        <div className="flex justify-end items-center gap-2">
          <Button
            variant="outline"
            onClick={deleteConfirmationModel.toggleModel}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              deleteHandler(student.id);
              // (() => );
            }}
          >
            {deletingStudent.loader || "Delete"}
          </Button>
        </div>
      )}
    </TableRow>
  );
}
