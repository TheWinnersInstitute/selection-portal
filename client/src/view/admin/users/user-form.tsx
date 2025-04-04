import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/hooks/use-loading";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  toggleUserForm: () => void;
  openUserForm: boolean;
  setUsers: Dispatch<SetStateAction<User[]>>;
  editData: User | null;
  setEditData: React.Dispatch<React.SetStateAction<User | null>>;
  roles: Role[];
};

type UserFormType = z.infer<typeof UserFormSchema>;

export default function UserForm({
  toggleUserForm,
  openUserForm,
  editData,
  setUsers,
  setEditData,
  roles,
}: Props) {
  const { apiClient } = useAuth();
  const processingUser = useLoading();

  const form = useForm<UserFormType>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      email: "",
      password: "",
      roleId: "",
    },
  });

  useEffect(() => {
    if (editData) {
      // form.setValue("", editData.name);
      // form.setValue("board", editData.board);
      // form.setValue("enrollment", editData.enrollment);
      // form.setValue("exam", editData.exam);
      // form.setValue("student", editData.student);
      // form.setValue("role", editData.role);
      // form.setValue("user", editData.user);
    }
  }, [editData]);

  const resetHandler = () => {
    toggleUserForm();
    form.reset();
    setEditData(null);
  };

  const onSubmit = (values: UserFormType) => {
    processingUser.asyncWrapper(async () => {
      const { data } = await apiClient[editData ? "patch" : "post"](
        "/api/admin/user",
        {
          ...values,
          ...(editData ? { id: editData.id } : {}),
        }
      );
      setUsers((prev) => {
        if (editData) {
          return prev.map((user) => {
            if (user.id === editData.id) {
              return data.data[0];
            }
            return user;
          });
        }
        return [...prev, data.data[0]];
      });
      resetHandler();
    });
  };

  return (
    <Dialog onOpenChange={toggleUserForm} open={openUserForm}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add user</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role, index) => {
                        return (
                          <SelectItem value={role.id} key={role.id}>
                            {role.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end items-center gap-2 mt-5">
              <Button variant="outline" onClick={resetHandler} type="button">
                Cancel
              </Button>
              <Button type="submit">{processingUser.loader || "Submit"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const UserFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  roleId: z.string(),
});
