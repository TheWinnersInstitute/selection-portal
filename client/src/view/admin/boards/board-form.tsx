import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BoardFormSchema } from ".";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/hooks/use-loading";
import { useData } from "@/context/DataContext";
import { UseFormReturn } from "react-hook-form";

export default function BoardForm({
  editData,
  showBoardForm,
  toggleBoardForm,
  form,
  setEditData,
}: Props) {
  const { apiClient } = useAuth();
  const { setBoards } = useData();
  const processingBoard = useLoading();

  const onSubmit = (values: z.infer<typeof BoardFormSchema>) => {
    processingBoard.asyncWrapper(async () => {
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
      toggleBoardForm();
    });
  };

  return (
    <Dialog open={showBoardForm} onOpenChange={toggleBoardForm}>
      <Button
        onClick={() => {
          form.reset();
          setEditData(null);
          toggleBoardForm();
        }}
        variant="outline"
      >
        Add Board
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Board form</DialogTitle>
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
                {processingBoard.loader || (editData ? "Update" : "Add")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

type Props = {
  editData: null | Board;
  showBoardForm: boolean;
  toggleBoardForm: () => void;
  form: UseFormReturn<z.infer<typeof BoardFormSchema>>;
  setEditData: (data: null | Board) => void;
};
