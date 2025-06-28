import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  toggleRoleForm: () => void;
  openRoleForm: boolean;
  setRoles: Dispatch<SetStateAction<Role[]>>;
  editData: Role | null;
  setEditData: React.Dispatch<React.SetStateAction<Role | null>>;
};

type RoleFormType = z.infer<typeof RoleFormSchema>;

const SECTIONS: { id: keyof RoleFormType; title: string }[] = [
  { title: "Board", id: "board" },
  { title: "Exam", id: "exam" },
  { title: "Student", id: "student" },
  { title: "Enrollment", id: "enrollment" },
  { title: "Role", id: "role" },
  { title: "User", id: "user" },
  { title: "Lucky Draw", id: "luckyDraw" },
  { title: "Banner", id: "banner" },
];

const items: { id: "read" | "create" | "update" | "delete"; label: string }[] =
  [
    {
      id: "read",
      label: "Read",
    },
    {
      id: "create",
      label: "Create",
    },
    {
      id: "update",
      label: "Update",
    },
    {
      id: "delete",
      label: "Delete",
    },
  ];

export default function RoleForm({
  toggleRoleForm,
  openRoleForm,
  editData,
  setRoles,
  setEditData,
}: Props) {
  const { apiClient } = useAuth();
  const processingRole = useLoading();

  const form = useForm<RoleFormType>({
    resolver: zodResolver(RoleFormSchema),
    defaultValues: {
      board: [],
      enrollment: [],
      exam: [],
      name: "",
      role: [],
      student: [],
      user: [],
      luckyDraw: [],
      banner: [],
    },
  });

  useEffect(() => {
    if (editData) {
      form.setValue("name", editData.name);
      form.setValue("board", editData.board);
      form.setValue("enrollment", editData.enrollment);
      form.setValue("exam", editData.exam);
      form.setValue("student", editData.student);
      form.setValue("role", editData.role);
      form.setValue("user", editData.user);
      form.setValue("luckyDraw", editData.luckyDraw);
    }
  }, [editData]);

  const resetHandler = () => {
    toggleRoleForm();
    form.reset();
    setEditData(null);
  };

  const onSubmit = (values: RoleFormType) => {
    processingRole.asyncWrapper(async () => {
      const { data } = await apiClient[editData ? "patch" : "post"](
        "/api/admin/role",
        {
          ...values,
          ...(editData ? { id: editData.id } : {}),
        }
      );
      setRoles((prev) => {
        if (editData) {
          return prev.map((role) => {
            if (role.id === editData.id) {
              return data.data[0];
            }
            return role;
          });
        }
        return [...prev, data.data[0]];
      });
      resetHandler();
    });
  };

  return (
    <Dialog onOpenChange={toggleRoleForm} open={openRoleForm}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add role</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {SECTIONS.map((section) => {
              return (
                <FormField
                  key={section.id}
                  control={form.control}
                  name={section.id}
                  render={() => (
                    <FormItem className="mt-3">
                      <FormLabel>{section.title}</FormLabel>
                      <div className="flex justify-between gap-2">
                        {items.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name={section.id}
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-1 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              item.id,
                                            ])
                                          : field.onChange(
                                              Array.isArray(field.value)
                                                ? field.value.filter(
                                                    (value) => value !== item.id
                                                  )
                                                : []
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
            <div className="flex justify-end items-center gap-2 mt-5">
              <Button variant="outline" onClick={resetHandler} type="button">
                Cancel
              </Button>
              <Button type="submit">{processingRole.loader || "Submit"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const RoleFormSchema = z.object({
  name: z.string(),
  board: z.array(z.enum(["read", "create", "update", "delete"])),
  enrollment: z.array(z.enum(["read", "create", "update", "delete"])),
  exam: z.array(z.enum(["read", "create", "update", "delete"])),
  student: z.array(z.enum(["read", "create", "update", "delete"])),
  role: z.array(z.enum(["read", "create", "update", "delete"])),
  user: z.array(z.enum(["read", "create", "update", "delete"])),
  luckyDraw: z.array(z.enum(["read", "create", "update", "delete"])),
  banner: z.array(z.enum(["read", "create", "update", "delete"])),
});
