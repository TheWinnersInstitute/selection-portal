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
import { Pen, Trash2 } from "lucide-react";
import { useLoading } from "@/hooks/use-loading";
import { useAuth } from "@/context/AuthContext";

type Props = {
  roles: Role[];
  toggleRoleForm: () => void;
  setEditData: React.Dispatch<React.SetStateAction<Role | null>>;
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
};

export default function RolesTable({
  roles,
  setEditData,
  setRoles,
  toggleRoleForm,
}: Props) {
  const { apiClient } = useAuth();

  const deletingRole = useLoading();

  const deleteHandler = (id: string) => {
    deletingRole.asyncWrapper(async () => {
      await apiClient.delete(`/api/admin/role/${id}`);
      setRoles((prev) => prev.filter((role) => role.id !== id));
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>S.No</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Board</TableHead>
          <TableHead>Exam</TableHead>
          <TableHead>Student</TableHead>
          <TableHead>Enrollment</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Banner</TableHead>
          <TableHead>Lucky draw</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.map((role, index) => {
          return (
            <TableRow key={role.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{role.name}</TableCell>
              <TableCell>{role.board.map((a) => a[0].toUpperCase())}</TableCell>
              <TableCell>{role.exam.map((a) => a[0].toUpperCase())}</TableCell>
              <TableCell>
                {role.student.map((a) => a[0].toUpperCase())}
              </TableCell>
              <TableCell>
                {role.enrollment.map((a) => a[0].toUpperCase())}
              </TableCell>
              <TableCell>{role.user.map((a) => a[0].toUpperCase())}</TableCell>
              <TableCell>{role.role.map((a) => a[0].toUpperCase())}</TableCell>
              <TableCell>
                {role.banner.map((a) => a[0].toUpperCase())}
              </TableCell>
              <TableCell>
                {role.luckyDraw.map((a) => a[0].toUpperCase())}
              </TableCell>
              <TableCell className="flex justify-end items-center gap-2">
                <Button
                  onClick={() => {
                    setEditData(role);
                    toggleRoleForm();
                  }}
                  size="icon"
                >
                  <Pen />
                </Button>
                <Button onClick={() => deleteHandler(role.id)} size="icon">
                  {deletingRole.loader || <Trash2 className="text-red-400" />}
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
