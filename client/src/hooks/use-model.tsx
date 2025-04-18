import { ReactNode, useCallback, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function useModel(title: string) {
  const [open, setOpen] = useState(false);

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

  return { content, toggleModel };
}
