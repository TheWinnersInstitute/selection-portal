import React, { useMemo, useState } from "react";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { FileUpload } from "@/components/ui/file-upload";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { StateAndCities } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useLoading } from "@/hooks/use-loading";

export const studentFormSchema = z.object({
  name: z.string().max(100).min(1),
  email: z.string().optional(),
  city: z.string().max(100).optional(),
  contactNumber: z.string().length(10),
  year: z.string().optional(),
  month: z.string().optional(),
  date: z.string().optional(),
  fatherName: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;

type Props = {
  editData: Student | null;
  toggleAddBoardForm: () => void;
  form: UseFormReturn<StudentFormValues, any, undefined>;
};

export default function StudentForm({
  editData,
  toggleAddBoardForm,
  form,
}: Props) {
  const [profile, setProfile] = useState<File | null>(null);

  const { setStudents } = useData();
  const { apiClient } = useAuth();

  const [selectedState] = form.watch(["state"]) as [
    keyof typeof StateAndCities
  ];

  const addingStudent = useLoading();

  function onSubmit(values: StudentFormValues) {
    addingStudent.asyncWrapper(async () => {
      try {
        const formData = new FormData();
        if (editData) formData.append("id", editData.id);
        if (values.year && values.date && values.month)
          formData.append(
            "dateOfBirth",
            `${values.year}-${values.month}-${values.date}`
          );
        if (values.city) formData.append("city", values.city);
        if (values.state) formData.append("state", values.state);
        if (values.contactNumber)
          formData.append("contactNumber", values.contactNumber);
        if (values.email) formData.append("email", values.email);
        if (values.fatherName) formData.append("fatherName", values.fatherName);
        if (values.name) formData.append("name", values.name);

        if (profile) formData.append("file", profile);

        const { data } = await apiClient[editData ? "patch" : "post"](
          "/api/student",
          formData
        );
        if (editData) {
          setStudents((prev) =>
            prev.map((student) => {
              if (student.id === editData.id) {
                return data.data[0];
              }
              return student;
            })
          );
        } else {
          setStudents((prev) => [...prev, data.data[0]]);
        }
        toggleAddBoardForm();
      } catch (error) {
        if (error instanceof AxiosError) {
          toast(error.response?.data?.message || "Something went wrong");
        }
      }
    });
  }

  const states = useMemo(() => {
    return Object.keys(StateAndCities);
  }, []);

  const cities = useMemo(() => {
    return [
      ...new Set(
        StateAndCities[
          (selectedState || "Madhya Pradesh") as keyof typeof StateAndCities
        ]
      ),
    ];
  }, [selectedState]);

  const handleProfileUpload = (files: File[]) => {
    if (files.length > 0) {
      setProfile(files[0]);
    }
  };

  const dateInputs = useMemo(() => {
    return [
      {
        name: "year" as keyof StudentFormValues,
        title: "Birth Year",
        options: Array(30)
          .fill(0)
          .map((_, index) => {
            return (new Date().getFullYear() - index + 1 - 10).toString();
          }),
      },
      {
        name: "month" as keyof StudentFormValues,
        title: "Birth Month",
        options: Array(12)
          .fill(0)
          .map((_, index) => {
            return (index + 1).toString();
          }),
      },
      {
        name: "date" as keyof StudentFormValues,
        title: "Birth Date",
        options: Array(31)
          .fill(0)
          .map((_, index) => {
            return (index + 1).toString();
          }),
      },
    ];
  }, []);

  return (
    <>
      <FileUpload
        title="Upload profile"
        onChange={handleProfileUpload}
        multiple={false}
      />
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
          <div className="space-x-2 flex">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>State</FormLabel>
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
                      {states.map((state, index) => {
                        return (
                          <SelectItem
                            value={state}
                            key={`${index + 1}-${state}`}
                          >
                            {state}
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
              name="city"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>City</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities.map((city, index) => {
                        return (
                          <SelectItem value={city} key={`${index + 1}-${city}`}>
                            {city}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact number</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Button disabled type="button" size="sm">
                      +91
                    </Button>
                    <Input placeholder="Enter contact number" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fatherName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter father name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between items-center gap-2">
            {dateInputs.map((input) => {
              return (
                <FormField
                  key={input.name}
                  control={form.control}
                  name={input.name}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{input.title}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {input.options.map((num, index) => {
                            return (
                              <SelectItem
                                value={num}
                                key={`${index + 1}-${num}`}
                              >
                                {num}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
          </div>

          <DialogFooter className="justify-between">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button>
              {addingStudent.loader || (editData ? "Update" : "Add")}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
