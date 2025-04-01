"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EllipsisVertical, MenuIcon, Pen, Trash2 } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(100, {
      message: "Name should no be more then 100 characters.",
    }),
  description: z
    .string()
    .max(1000, {
      message: "Description should no be more then 1000 characters.",
    })
    .optional(),
});

export default function AdminBoardPage() {
  const { apiClient } = useAuth();
  const [showAddBoardForm, setShowAddBoardForm] = useState(false);
  const { boards, setBoards } = useData();
  const [editData, setEditData] = useState<null | Board>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data } = await apiClient[editData ? "patch" : "post"](
        "/api/board",
        {
          ...(editData ? { id: editData.id } : {}),
          ...values,
        }
      );
      if (editData) {
        setBoards((prev) =>
          prev.map((board) => {
            if (board.id === editData.id) {
              return data.data[0];
            }
            return board;
          })
        );
      } else {
        setBoards((prev) => [...prev, data.data[0]]);
      }
      form.reset();
      toggleAddBoardForm();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast(error.response?.data?.message || "Something went wrong");
      }
    }
  }

  const toggleAddBoardForm = () => setShowAddBoardForm((prev) => !prev);

  const deleteHandler = async (id: string) => {
    try {
      await apiClient.delete(`/api/board/${id}`);
      toast("Board deleted successfully");
      setBoards((prev) => prev.filter((board) => board.id !== id));
    } catch (error) {
      if (error instanceof AxiosError) {
        toast(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center pt-3">
        <h2>Boards</h2>
        <Dialog open={showAddBoardForm} onOpenChange={toggleAddBoardForm}>
          <Button
            onClick={() => {
              form.reset();
              setEditData(null);
              toggleAddBoardForm();
            }}
            variant="outline"
          >
            Add Board
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create board form</DialogTitle>
              {/* <DialogDescription>
                
              </DialogDescription> */}
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter board name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter board description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="justify-between">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                  <Button>{editData ? "Update" : "Add"}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      {boards.length === 0 && (
        <p className="flex justify-center my-1">No data</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
        {boards.map((board) => {
          return (
            <div
              className="bg-secondary px-5 py-3 rounded-sm flex flex-col"
              key={board.id}
            >
              <div className="flex justify-between items-center">
                <Link
                  href={`/admin/exam?board=${board.id}`}
                  className="text-xl font-bold"
                >
                  {board.name} ({board.enrollmentCount})
                </Link>
                <Menubar className="bg-transparent border-0 p-0">
                  <MenubarMenu>
                    <MenubarTrigger className="p-0">
                      <EllipsisVertical />
                    </MenubarTrigger>
                    <MenubarContent>
                      <MenubarItem
                        onClick={() => {
                          setEditData(board);
                          form.setValue("name", board.name);
                          form.setValue("description", board.description);
                          toggleAddBoardForm();
                        }}
                      >
                        Edit{" "}
                        <MenubarShortcut>
                          <Pen />
                        </MenubarShortcut>
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem
                        onClick={() => {
                          deleteHandler(board.id);
                        }}
                      >
                        Delete
                        <MenubarShortcut>
                          <Trash2 />
                        </MenubarShortcut>
                      </MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              </div>
              <p className="text-xs opacity-60">{board.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
