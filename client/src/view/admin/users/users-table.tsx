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
  users: User[];
  toggleUserForm: () => void;
  setEditData: React.Dispatch<React.SetStateAction<User | null>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

export default function UsersTable({
  users,
  setEditData,
  setUsers,
  toggleUserForm,
}: Props) {
  const { apiClient } = useAuth();

  const deletingUser = useLoading();

  const deleteHandler = (id: string) => {
    deletingUser.asyncWrapper(async () => {
      await apiClient.delete(`/api/admin/user/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>S.No</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          {/* <TableHead>Exam</TableHead>
          <TableHead>Student</TableHead>
          <TableHead>Enrollment</TableHead>
          <TableHead>User</TableHead> */}
          {/* <TableHead>User</TableHead> */}
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, index) => {
          return (
            <TableRow key={user.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role?.name || "-"}</TableCell>
              {/* <TableCell>{user.exam.map((a) => a[0].toUpperCase())}</TableCell>
              <TableCell>
                {user.student.map((a) => a[0].toUpperCase())}
              </TableCell>
              <TableCell>
                {user.enrollment.map((a) => a[0].toUpperCase())}
              </TableCell>
              <TableCell>{user.user.map((a) => a[0].toUpperCase())}</TableCell>
              <TableCell>{user.user.map((a) => a[0].toUpperCase())}</TableCell> */}
              <TableCell className="flex justify-end items-center gap-2">
                <Button
                  onClick={() => {
                    setEditData(user);
                    toggleUserForm();
                  }}
                  size="icon"
                >
                  <Pen />
                </Button>
                <Button onClick={() => deleteHandler(user.id)} size="icon">
                  {deletingUser.loader || <Trash2 />}
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
