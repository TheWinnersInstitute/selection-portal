import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/hooks/use-loading";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

type Props = {
  enrollment: Enrollment;
  index: number;
  onDelete: () => void;
};

export default function EnrollmentRow({ enrollment, index, onDelete }: Props) {
  const { apiClient } = useAuth();

  const deleting = useLoading();

  const deleteHandler = (id: string) => {
    deleting.asyncWrapper(async () => {
      try {
        await apiClient.delete(`/api/student/enrollment/${id}`);
        onDelete();
      } catch (error) {
        if (error instanceof AxiosError)
          toast(error.response?.data?.message || "Something went wrong");
      }
    });
  };

  return (
    <TableRow>
      <TableCell>{index + 1}</TableCell>
      <TableCell
        className={enrollment?.resultId ? "text-blue-500" : ""}
        onClick={(e) => {
          e.stopPropagation();
          const resultId = enrollment?.resultId;
          if (resultId) {
            window.open(
              `${process.env.NEXT_PUBLIC_API_URL}/api/admin/assets/${resultId}`,
              "_blank",
              "noopener,noreferrer"
            );
          }
        }}
      >
        {enrollment.post}
      </TableCell>
      {/* @ts-ignore */}
      <TableCell>{enrollment.rank}</TableCell>
      <TableCell>{enrollment.exam.name.slice(0, 15)}</TableCell>
      <TableCell>{enrollment.rollNumber}</TableCell>
      <TableCell>
        <Button
          variant="outline"
          onClick={() => {
            deleteHandler(enrollment.id);
          }}
          size="sm"
        >
          {deleting.loader || "Delete"}
        </Button>
      </TableCell>
    </TableRow>
  );
}
