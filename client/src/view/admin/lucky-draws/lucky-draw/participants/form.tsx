import { Button } from "@/components/ui/button";
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
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/hooks/use-loading";
import { useParams } from "next/navigation";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

type Props = {
  toggleLuckyDrawParticipantForm: () => void;
  openLuckyDrawParticipantForm: boolean;
  setLuckyDrawParticipants?: Dispatch<SetStateAction<LuckyDrawParticipant[]>>;
  editData?: LuckyDrawParticipant | null;
  setEditData?: React.Dispatch<
    React.SetStateAction<LuckyDrawParticipant | null>
  >;
  form: UseFormReturn<LuckyDrawParticipantFormType>;
};

export type LuckyDrawParticipantFormType = z.infer<
  typeof LuckyDrawParticipantFormSchema
>;

export default function LuckyDrawParticipantForm({
  toggleLuckyDrawParticipantForm,
  openLuckyDrawParticipantForm,
  editData,
  setLuckyDrawParticipants,
  setEditData,
  form,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const { apiClient } = useAuth();
  const processingLuckyDrawParticipant = useLoading();
  const params = useParams();

  useEffect(() => {
    if (editData) {
      form.setValue("name", editData.name);
      form.setValue("phone", editData.phone);
      form.setValue("email", editData.email);
    }
  }, [editData]);

  const resetHandler = () => {
    toggleLuckyDrawParticipantForm();
    form.reset();
    setEditData?.(null);
  };

  const onSubmit = (values: LuckyDrawParticipantFormType) => {
    processingLuckyDrawParticipant.asyncWrapper(async () => {
      const formData = new FormData();

      if (file) formData.append("file", file);
      if (editData) formData.append("id", editData.id);
      formData.append("name", values.name);
      // formData.append("luckyDrawId",  as string);
      formData.append("email", values.email);
      formData.append("phone", values.phone);

      const { data } = await apiClient[editData ? "patch" : "post"](
        `/api/lucky-draw/participant/${params.luckyDrawId}`,
        formData
      );
      setLuckyDrawParticipants?.((prev) => {
        if (editData) {
          return prev.map((participant) => {
            if (participant.id === editData.id) {
              return data.data[0];
            }
            return participant;
          });
        }
        return [...prev, data.data[0]];
      });
      resetHandler();
    });
  };

  return (
    <Dialog
      onOpenChange={toggleLuckyDrawParticipantForm}
      open={openLuckyDrawParticipantForm}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Participate</DialogTitle>
        </DialogHeader>
        <FileUpload
          multiple={false}
          showPreview
          title="Upload profile photo"
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone number" {...field} />
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
                    <Input placeholder="Email" {...field} />
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
                {processingLuckyDrawParticipant.loader || "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export const LuckyDrawParticipantFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
});
