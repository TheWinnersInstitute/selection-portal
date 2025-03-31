"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import axios, { Axios, AxiosError } from "axios";
import React, { useEffect, useMemo, useState } from "react";
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
import { CalendarIcon, Pen, Pencil, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

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
  examDate: z.date(),
  boardId: z.string().uuid(),
});

export default function AdminExamsPage() {
  const { apiClient } = useAuth();
  const [showAddBoardForm, setShowAddBoardForm] = useState(false);
  const { boards, setExams, exams } = useData();
  const [editData, setEditData] = useState<null | Board>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      name: "",
      examDate: new Date(),
    },
  });

  useEffect(() => {
    if ([].length === 0) {
      (async () => {
        try {
          const { data } = await apiClient.get("/api/exam");
          setExams(data.data);
        } catch (error) {
          if (error instanceof AxiosError)
            toast(error.response?.data?.message || "Something went wrong");
        }
      })();
    }
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data } = await apiClient[editData ? "patch" : "post"](
        "/api/exam",
        {
          ...(editData ? { id: editData.id } : {}),
          ...values,
          examDate: new Date(values.examDate),
        }
      );
      if (editData) {
        setExams((prev) =>
          prev.map((exam) => {
            if (exam.id === editData.id) {
              return data.data[0];
            }
            return exam;
          })
        );
      } else {
        setExams((prev) => [...prev, data.data[0]]);
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
      await apiClient.delete(`/api/exam/${id}`);
      toast("Board deleted successfully");
      setExams((prev) => prev.filter((exam) => exam.id !== id));
    } catch (error) {
      if (error instanceof AxiosError) {
        toast(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  const boardsMap = useMemo(() => {
    return boards.reduce((prev, curr) => {
      prev[curr.id] = curr;
      return prev;
    }, {} as { [key: string]: Board });
  }, [boards]);

  return (
    <div>
      <div className="flex justify-between items-center pt-3">
        <h2>Exams</h2>
        <Dialog open={showAddBoardForm} onOpenChange={toggleAddBoardForm}>
          <Button
            onClick={() => {
              form.reset();
              setEditData(null);
              toggleAddBoardForm();
            }}
            variant="outline"
          >
            Add Exam
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create exam form</DialogTitle>
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
                  name="examDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exam date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              // className={cn(
                              //   "w-[240px] pl-3 text-left font-normal",
                              //   !field.value && "text-muted-foreground"
                              // )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={new Date(field.value)}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="boardId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Board</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a verified email to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {boards.map((board) => {
                            return (
                              <SelectItem value={board.id} key={board.id}>
                                {board.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
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
      {exams.length === 0 && (
        <p className="flex justify-center my-1">No data</p>
      )}
      <div className="flex justify-between flex-wrap gap-5  mt-5">
        {exams.map((exam) => {
          return (
            <div
              className="bg-secondary px-5 py-3 rounded-sm flex-1 flex flex-col max-w-1/3"
              key={exam.id}
            >
              <h2 className="text-xl font-bold">
                {exam.name} ({exam.enrollmentCount})
              </h2>
              <p className="text-sm">{boardsMap[exam.boardId]?.name}</p>
              <p className="text-xs opacity-60">{exam.description}</p>
              <div className="flex-1"></div>
              <div className="flex justify-between items-center mt-3 gap-2">
                <Button
                  onClick={() => {
                    setEditData(exam);
                    form.setValue("name", exam.name);
                    form.setValue("description", exam.description);
                    form.setValue("boardId", exam.boardId);
                    form.setValue("examDate", new Date(exam.examDate));
                    toggleAddBoardForm();
                  }}
                  variant="outline"
                  className="flex-1"
                  size="sm"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    deleteHandler(exam.id);
                  }}
                  className="flex-1"
                  size="sm"
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
