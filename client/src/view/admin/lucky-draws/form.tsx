import { Button } from "@/components/ui/button";
import DateTimePicker from "@/components/ui/date-time-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/hooks/use-loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

type Props = {
  toggleLuckyDrawForm: () => void;
  openLuckyDrawForm: boolean;
  setLuckyDraws: Dispatch<SetStateAction<LuckyDraw[]>>;
  editData: LuckyDraw | null;
  setEditData: React.Dispatch<React.SetStateAction<LuckyDraw | null>>;
  form: UseFormReturn<LuckyDrawFormType>;
};

export type LuckyDrawFormType = z.infer<typeof LuckyDrawFormSchema>;

export default function LuckyDrawForm({
  toggleLuckyDrawForm,
  openLuckyDrawForm,
  editData,
  setLuckyDraws,
  setEditData,
  form,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const { apiClient } = useAuth();
  const processingLuckyDraw = useLoading();

  useEffect(() => {
    if (editData) {
      form.setValue("name", editData.name);
      form.setValue("openingDate", new Date(editData.openingDate));
      form.setValue(
        "participationEndDate",
        new Date(editData.participationEndDate)
      );
    }
  }, [editData]);

  const resetHandler = () => {
    toggleLuckyDrawForm();
    form.reset();
    setEditData(null);
  };

  const onSubmit = (values: LuckyDrawFormType) => {
    // console.log();
    processingLuckyDraw.asyncWrapper(async () => {
      const formData = new FormData();

      if (file) formData.append("file", file);
      if (editData) formData.append("id", editData.id);

      formData.append("name", values.name);
      formData.append("openingDate", values.openingDate.toLocaleString());
      formData.append(
        "participationEndDate",
        values.participationEndDate.toLocaleString()
      );

      const { data } = await apiClient[editData ? "patch" : "post"](
        "/api/lucky-draw",
        formData
      );
      setLuckyDraws((prev) => {
        if (editData) {
          return prev.map((luckyDraw) => {
            if (luckyDraw.id === editData.id) {
              return data.data[0];
            }
            return luckyDraw;
          });
        }
        return [...prev, data.data[0]];
      });
      resetHandler();
    });
  };

  return (
    <Dialog onOpenChange={toggleLuckyDrawForm} open={openLuckyDrawForm}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add luckyDraw</DialogTitle>
        </DialogHeader>
        <FileUpload
          multiple={false}
          showPreview
          title="Upload banner"
          onChange={(files) => {
            if (files[0]) {
              setFile(files[0]);
            }
          }}
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
              name="openingDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opening date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"}>
                            {field.value ? (
                              format(field.value, "PPP p")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <DateTimePicker
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="participationEndDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration end date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"}>
                            {field.value ? (
                              format(field.value, "PPP p")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <DateTimePicker
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end items-center gap-2 mt-5">
              <Button variant="outline" onClick={resetHandler} type="button">
                Cancel
              </Button>
              <Button type="submit">
                {processingLuckyDraw.loader || "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export const LuckyDrawFormSchema = z.object({
  name: z.string(),
  openingDate: z.date(),
  participationEndDate: z.date(),
});
