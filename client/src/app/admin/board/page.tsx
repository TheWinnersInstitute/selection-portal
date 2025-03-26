"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Axios, AxiosError } from "axios";
import React, { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

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
      {boards.length > 0 && (
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>S.No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {boards.map((board, index) => (
              <TableRow key={board.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{board.name}</TableCell>
                <TableCell>{board.description.slice(0, 40)}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditData(board);
                      form.setValue("name", board.name);
                      form.setValue("description", board.description);
                      toggleAddBoardForm();
                    }}
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      deleteHandler(board.id);
                    }}
                    size="sm"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
