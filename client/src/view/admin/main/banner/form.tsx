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
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

type Props = {
  toggleBannerForm: () => void;
  openBannerForm: boolean;
  setBanners: Dispatch<SetStateAction<Banner[]>>;
  editData: Banner | null;
  setEditData: React.Dispatch<React.SetStateAction<Banner | null>>;
  form: UseFormReturn<BannerFormType>;
};

export type BannerFormType = z.infer<typeof BannerFormSchema>;

export default function BannerForm({
  toggleBannerForm,
  openBannerForm,
  editData,
  setBanners,
  setEditData,
  form,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const { apiClient } = useAuth();
  const processingBanner = useLoading();

  //   useEffect(() => {
  //     if (editData) {
  //       form.setValue("name", editData.name);
  //       form.setValue("link", editData.link?.toString());
  //       form.setValue("sequence", editData.sequence);
  //     }
  //   }, [editData]);

  const resetHandler = () => {
    toggleBannerForm();
    form.reset();
    setEditData(null);
  };

  const onSubmit = (values: BannerFormType) => {
    // console.log();
    processingBanner.asyncWrapper(async () => {
      const formData = new FormData();

      if (file) formData.append("file", file);
      if (editData) formData.append("id", editData.id);

      formData.append("name", values.name);
      formData.append("sequence", values.sequence);
      if (values.link) formData.append("link", values.link);

      const { data } = await apiClient[editData ? "patch" : "post"](
        "/api/banner",
        formData
      );
      setBanners(data.data);
      resetHandler();
    });
  };

  return (
    <Dialog onOpenChange={toggleBannerForm} open={openBannerForm}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add banner</DialogTitle>
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
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://google.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sequence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sequence</FormLabel>
                  <FormControl>
                    <Input placeholder="1" {...field} />
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
                {processingBanner.loader || "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export const BannerFormSchema = z.object({
  name: z.string(),
  link: z.string().optional(),
  sequence: z.string(),
});
