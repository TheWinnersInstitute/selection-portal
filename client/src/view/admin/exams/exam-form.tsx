import React, { useState } from "react";
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

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon, EllipsisVertical, Pen, Trash2 } from "lucide-react";
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
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/hooks/use-loading";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { ExamFormSchema } from ".";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

export default function ExamForm({
  editData,
  form,
  setEditData,
  showAddBoardForm,
  toggleExamForm,
}: Props) {
  const processingExam = useLoading();
  const { apiClient } = useAuth();
  const { setExams, boards } = useData();

  const onSubmit = async (values: z.infer<typeof ExamFormSchema>) => {
    processingExam.asyncWrapper(async () => {
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
      toggleExamForm();
    });
  };

  return (
    <Dialog open={showAddBoardForm} onOpenChange={toggleExamForm}>
      <Button
        onClick={() => {
          form.reset();
          setEditData(null);
          toggleExamForm();
        }}
        variant="outline"
      >
        Add Exam
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? "Update" : "Add"} exam</DialogTitle>
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
                        <Button variant={"outline"}>
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
              <Button>
                {processingExam.loader || (editData ? "Update" : "Add")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

type Props = {
  showAddBoardForm: boolean;
  editData: null | Exam;
  setEditData: React.Dispatch<React.SetStateAction<null | Exam>>;
  form: UseFormReturn<
    z.infer<typeof ExamFormSchema>,
    any,
    z.infer<typeof ExamFormSchema>
  >;
  toggleExamForm: () => void;
};
