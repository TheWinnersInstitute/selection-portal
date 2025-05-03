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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  enrollment: Enrollment;
  index: number;
  onDelete: () => void;
  showDetails?: boolean;
};

export default function EnrollmentRow({
  enrollment,
  showDetails,
  onDelete,
}: Props) {
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
    <TableRow className="w-[40vw] text-xs">
      <TableCell
        className={`${
          enrollment?.resultId ? "text-blue-500 " : ""
        } w-[10vw] text-xs`}
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
        {enrollment.post && enrollment.post.length > 15 ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>{enrollment.post.slice(0, 15)}...</TooltipTrigger>
              <TooltipContent>
                <p>{enrollment.post}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          enrollment.post || "-"
        )}
      </TableCell>
      <TableCell className="w-[5vw]">
        {/* @ts-ignore */}
        {enrollment.rank || "-"}
      </TableCell>
      {showDetails && (
        <TableCell className="w-20">{enrollment.selectionIn || "-"}</TableCell>
      )}

      {/* )} */}
      <TableCell>{enrollment.exam.name.slice(0, 15)}</TableCell>
      <TableCell>{enrollment.examCategory?.name || "-"}</TableCell>
      <TableCell>{enrollment.rollNumber}</TableCell>
      {showDetails && (
        <TableCell>
          <Button
            variant="outline"
            onClick={deleteConfirmationModel.toggleModel}
            size="icon"
          >
            {deleting.loader || <Trash2 className="text-red-400" />}
          </Button>
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
        </TableCell>
      )}
    </TableRow>
  );
}
