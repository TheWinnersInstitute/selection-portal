import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useLoading } from "@/hooks/use-loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  toggleEnrollmentForm: () => void;
  studentId: string;
  setCurrentStudent: (data: Student | null) => void;
};

export default function EnrollmentForm({
  toggleEnrollmentForm,
  studentId,
  setCurrentStudent,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const { exams, setStudents } = useData();
  const { apiClient } = useAuth();

  const enrolling = useLoading();

  const form = useForm<z.infer<typeof EnrollmentFormSchema>>({
    resolver: zodResolver(EnrollmentFormSchema),
    defaultValues: {
      examId: "",
      post: "",
      rollNumber: "",
      rank: "",
      selectionIn: "",
      examCategoryId: "",
      year: new Date().getFullYear(),
    },
  });

  const [examId] = form.watch(["examId"]);

  const handleProfileUpload = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const onSubmit = (values: z.infer<typeof EnrollmentFormSchema>) => {
    enrolling.asyncWrapper(async () => {
      try {
        const formData = new FormData();

        if (file) {
          formData.append("file", file);
        }
        formData.append("examId", values.examId);
        formData.append("studentId", studentId);
        if (values.post) formData.append("post", values.post);
        if (values.rank) formData.append("rank", values.rank);
        if (values.rollNumber) formData.append("rollNumber", values.rollNumber);
        if (values.selectionIn)
          formData.append("selectionIn", values.selectionIn);
        if (values.examCategoryId)
          formData.append("examCategoryId", values.examCategoryId);
        if (values.year) formData.append("year", values.year.toString());

        const { data } = await apiClient.post(
          "/api/student/enrollment",
          formData
        );
        let updatedStudent;
        setStudents((prev) =>
          prev.map((student) => {
            if (student.id === studentId) {
              updatedStudent = {
                ...student,
                Enrollment: [...(student.Enrollment || []), data.data[0]],
              };
              return updatedStudent;
            }
            return student;
          })
        );
        setFile(null);
        setCurrentStudent(updatedStudent || null);
        toggleEnrollmentForm();
      } catch (error) {
        if (error instanceof AxiosError)
          toast(error.response?.data?.message || "Something went wrong");
      }
    });
  };

  const examCategories = useMemo(() => {
    const exam = exams.find((exam) => exam.id === examId);
    if (exam) {
      return exam.examCategories;
    }
    return [];
  }, [examId, exams]);

  return (
    <div>
      <FileUpload
        title="Upload result"
        onChange={handleProfileUpload}
        multiple={false}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="post"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post</FormLabel>
                <FormControl>
                  <Input placeholder="Enter post" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rollNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roll number</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter roll number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rank"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rank</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter rank" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="examId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exam</FormLabel>
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
                    {exams.map((exam, index) => {
                      return (
                        <SelectItem value={exam.id} key={exam.id}>
                          {exam.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {examCategories.length > 0 && (
            <FormField
              control={form.control}
              name="examCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam category</FormLabel>
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
                      {examCategories.map((category) => {
                        return (
                          <SelectItem value={category.id} key={category.id}>
                            {category.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    maxLength={4}
                    placeholder="Enrollment year"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="selectionIn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selection In</FormLabel>
                <FormControl>
                  <Input
                    type="string"
                    placeholder="Enter year of selection"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="justify-between">
            <DialogClose asChild>
              <Button
                onClick={toggleEnrollmentForm}
                type="button"
                variant="secondary"
              >
                Close
              </Button>
            </DialogClose>
            <Button>Add</Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}

export const EnrollmentFormSchema = z.object({
  post: z.string({ message: "Post is request" }),
  examId: z.string({ message: "Please select exam" }),
  rank: z.string().optional(),
  selectionIn: z.string().optional(),
  examCategoryId: z.string().optional(),
  year: z.number().optional(),
  rollNumber: z
    .string({ message: "Please enter the roll number" })
    .min(1)
    .max(100),
});
