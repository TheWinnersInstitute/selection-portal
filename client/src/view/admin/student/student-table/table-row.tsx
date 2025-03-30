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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/hooks/use-loading";
import { toast } from "sonner";
import { useData } from "@/context/DataContext";
import { AxiosError } from "axios";
import { format } from "date-fns";

type Props = {
  student: Student;
  index: number;
  editHandler: (data: Student) => void;
  onClick?: () => void;
};
export default function StudentTableRow({
  student,
  index,
  editHandler,
  onClick,
}: Props) {
  const nameArray = student.name.split(" ");

  const { setStudents } = useData();
  const { apiClient } = useAuth();

  const deletingStudent = useLoading();

  const deleteHandler = async (id: string) => {
    try {
      await apiClient.delete(`/api/student/${id}`);
      toast("Student deleted successfully");
      setStudents((prev) => prev.filter((student) => student.id !== id));
    } catch (error) {
      if (error instanceof AxiosError) {
        toast(error.response?.data?.message || "Something went wrong");
      }
    }
  };
  return (
    <TableRow onClick={onClick}>
      <TableCell>{index + 1}</TableCell>
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
      <TableCell>{student.email || "-"}</TableCell>
      <TableCell>
        {student.dateOfBirth
          ? format(new Date(student.dateOfBirth), "PPP")
          : "-"}
      </TableCell>

      {/* <TableCell
        className={student.Enrollment?.[0]?.resultId ? "text-blue-500" : ""}
        onClick={(e) => {
          e.stopPropagation();
          const resultId = student.Enrollment?.[0]?.resultId;
          if (resultId) {
            window.open(
              `${process.env.NEXT_PUBLIC_API_URL}/api/admin/assets/${resultId}`,
              "_blank",
              "noopener,noreferrer"
            );
          }
        }}
      >
        {student.Enrollment?.[0]?.post}{" "}
        {student.Enrollment && student.Enrollment?.length > 0
          ? `(${student.Enrollment?.length})`
          : "-"}
      </TableCell> */}
      <TableCell className="text-center">
        {student.Enrollment?.length || "-"}
      </TableCell>
      {/* <TableCell>{student.Enrollment?.[0]?.rollNumber || "-"}</TableCell> */}
      <TableCell onClick={(e) => e.stopPropagation()} className="space-x-1">
        <Button
          variant="outline"
          onClick={() => {
            editHandler(student);
          }}
          size="sm"
        >
          Edit
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            deletingStudent.asyncWrapper(() => deleteHandler(student.id));
          }}
          size="sm"
        >
          {deletingStudent.loader || "Delete"}
        </Button>
      </TableCell>
    </TableRow>
  );
}
