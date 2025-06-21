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
import { useParams } from "next/navigation";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

type Props = {
  toggleLuckyDrawRewardForm: () => void;
  openLuckyDrawRewardForm: boolean;
  setLuckyDrawRewards: Dispatch<SetStateAction<LuckyDrawReward[]>>;
  editData: LuckyDrawReward | null;
  setEditData: React.Dispatch<React.SetStateAction<LuckyDrawReward | null>>;
  form: UseFormReturn<LuckyDrawRewardFormType>;
};

export type LuckyDrawRewardFormType = z.infer<typeof LuckyDrawRewardFormSchema>;

export default function LuckyDrawRewardForm({
  toggleLuckyDrawRewardForm,
  openLuckyDrawRewardForm,
  editData,
  setLuckyDrawRewards,
  setEditData,
  form,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const { apiClient } = useAuth();
  const processingLuckyDrawReward = useLoading();
  const params = useParams();

  useEffect(() => {
    if (editData) {
      form.setValue("name", editData.name);
      // form.setValue("luckyDrawId", editData.luckyDrawId);
      form.setValue("count", editData.count);
    }
  }, [editData]);

  const resetHandler = () => {
    toggleLuckyDrawRewardForm();
    form.reset();
    setEditData(null);
  };

  const onSubmit = (values: LuckyDrawRewardFormType) => {
    processingLuckyDrawReward.asyncWrapper(async () => {
      const formData = new FormData();

      if (file) formData.append("file", file);
      if (editData) formData.append("id", editData.id);
      formData.append("name", values.name);
      // formData.append("luckyDrawId",  as string);
      formData.append("count", values.count.toString());

      const { data } = await apiClient[editData ? "patch" : "post"](
        `/api/lucky-draw/reward/${params.luckyDrawId}`,
        formData
      );
      setLuckyDrawRewards((prev) => {
        if (editData) {
          return prev.map((luckyDrawReward) => {
            if (luckyDrawReward.id === editData.id) {
              return data.data[0];
            }
            return luckyDrawReward;
          });
        }
        return [...prev, data.data[0]];
      });
      resetHandler();
    });
  };

  return (
    <Dialog
      onOpenChange={toggleLuckyDrawRewardForm}
      open={openLuckyDrawRewardForm}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add lucky draw reward</DialogTitle>
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
              name="count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Count</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Count"
                      {...field}
                      onChange={(e) => {
                        const num = parseInt(e.target.value, 10);
                        if (!isNaN(num)) {
                          field.onChange(num);
                        }
                      }}
                    />
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
                {processingLuckyDrawReward.loader || "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export const LuckyDrawRewardFormSchema = z.object({
  name: z.string(),
  // luckyDrawId: z.string(),
  count: z.number(),
});
