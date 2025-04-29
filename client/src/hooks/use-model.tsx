import { ReactNode, useCallback, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLoading } from "./use-loading";

export function useModel(title: string) {
  const [open, setOpen] = useState(false);

  const deleting = useLoading();

  const toggleModel = () => setOpen((prev) => !prev);

  const content = useCallback(
    (children: ReactNode) => {
      return (
        <Dialog open={open} onOpenChange={toggleModel}>
          <DialogContent
            onClick={(e) => e.stopPropagation()}
            className="lg:max-w-[50vw]"
          >
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            {children}
          </DialogContent>
        </Dialog>
      );
    },
    [open]
  );

  const confirmationModel = useCallback(
    (action: string, onAction: () => Promise<void>) => {
      return content(
        <div className="flex justify-end items-center gap-2">
          <Button variant="outline" onClick={toggleModel}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              deleting.asyncWrapper(async () => {
                await onAction();
                toggleModel();
              });
            }}
          >
            {deleting.loader || action}
          </Button>
        </div>
      );
    },
    [content]
  );

  return { content, toggleModel, confirmationModel };
}
