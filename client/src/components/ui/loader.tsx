import React from "react";

const Loader = ({ variant = "danger", message = "Loading..." }: Props) => {
  return (
    <div className="h-[50vh] flex justify-center items-center flex-col gap-1">
      <div className="flex space-x-2 justify-center items-center bg-white  dark:invert">
        <div className="h-8 w-8 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-8 w-8 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-8 w-8 bg-red-500 rounded-full animate-bounce"></div>
      </div>
      <span className="font-semibold text-secondary-foreground">{message}</span>
    </div>
  );
};

type Props = {
  variant:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "neutral";
  message: string;
};

export default Loader;
