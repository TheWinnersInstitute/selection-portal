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
import { Trash2 } from "lucide-react";
import { useModel } from "@/hooks/use-model";

type Props = {
  enrollment: Enrollment;
  index: number;
  onDelete: () => void;
};

export default function EnrollmentRow({ enrollment, index, onDelete }: Props) {
  const { apiClient } = useAuth();

  const deleting = useLoading();
  const deleteConfirmationModel = useModel(
    "Are you sure you want to delete this enrollment ??"
  );

  const deleteHandler = (id: string) => {
    deleting.asyncWrapper(async () => {
      await apiClient.delete(`/api/student/enrollment/${id}`);
      onDelete();
      deleteConfirmationModel.toggleModel();
    });
  };

  return (
    <TableRow>
      <TableCell
        className={`${enrollment?.resultId ? "text-blue-500" : ""}`}
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
        <div className="w-20">{enrollment.post}</div>
      </TableCell>
      <TableCell>
        {/* @ts-ignore */}
        <div className="w-10">{enrollment.rank || "-"}</div>
      </TableCell>
      <TableCell>
        <div className="w-20">{enrollment.exam.name.slice(0, 15)}</div>
      </TableCell>
      <TableCell>
        <div className="w-20">{enrollment.rollNumber}</div>
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          onClick={deleteConfirmationModel.toggleModel}
          size="icon"
        >
          {deleting.loader || <Trash2 />}
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
              deleteHandler(enrollment.id);
            }}
          >
            {deleting.loader || "Delete"}
          </Button>
        </div>
      )}
    </TableRow>
  );
}
