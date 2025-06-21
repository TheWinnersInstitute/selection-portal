import React from "react";
import { Calendar } from "./calendar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectSeparator,
} from "./select";

export default function DateTimePicker({ onChange, value }: Props) {
  return (
    <div className="">
      <Calendar
        className="flex-1"
        mode="single"
        selected={new Date(value || "")}
        onSelect={(date) => {
          if (date && onChange) {
            const currentDateTime = new Date(value || "");
            currentDateTime.setDate(date.getDate());
            currentDateTime.setMonth(date.getMonth());
            currentDateTime.setFullYear(date.getFullYear());
            currentDateTime.setSeconds(0, 0);
            onChange(new Date(currentDateTime));
          }
        }}
        disabled={(date) => date < new Date()}
        initialFocus
      />
      {/* <SelectSeparator /> */}
      {/* <p className="p-1 opacity-60 text-xs ]">
        Please select date first then time
      </p> */}
      <Select
        onValueChange={(v) => {
          const [hour, minute] = v.split(":");
          const currentDate = new Date(value || "");
          const updatedDate = new Date(
            currentDate.setHours(parseInt(hour, 10), parseInt(minute, 10))
          );
          onChange?.(updatedDate);
        }}
      >
        <SelectTrigger className="bg-transparent border-0 w-full mb-0 rounded-none">
          <SelectValue placeholder="Time" />
        </SelectTrigger>
        <SelectContent>
          {TIME_SLOT.map((item, i) => {
            return (
              <SelectItem key={item.value} value={item.value}>
                {item.title}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

type Props = {
  value?: Date;
  onChange?: (a: Date | undefined) => void;
};

const TIME_SLOT = [
  {
    value: "08:00",
    title: "08:00 AM",
  },
  {
    value: "08:30",
    title: "08:30 AM",
  },
  {
    value: "09:00",
    title: "09:00 AM",
  },
  {
    value: "09:30",
    title: "09:30 AM",
  },

  {
    value: "10:00",
    title: "10:00 AM",
  },
  {
    value: "10:30",
    title: "10:30 AM",
  },
  {
    value: "11:00",
    title: "11:00 AM",
  },
  {
    value: "11:30",
    title: "11:30 AM",
  },
  {
    value: "12:00",
    title: "12:00 PM",
  },
  {
    value: "12:30",
    title: "12:30 PM",
  },
  {
    value: "13:00",
    title: "01:00 PM",
  },
  {
    value: "13:30",
    title: "01:30 PM",
  },
  {
    value: "14:00",
    title: "02:00 PM",
  },
  {
    value: "14:30",
    title: "02:30 PM",
  },
  {
    value: "15:00",
    title: "03:00 PM",
  },
  {
    value: "15:30",
    title: "03:30 PM",
  },
  {
    value: "16:00",
    title: "04:00 PM",
  },
  {
    value: "16:30",
    title: "04:30 PM",
  },
  {
    value: "17:00",
    title: "05:00 PM",
  },
  {
    value: "17:30",
    title: "05:30 PM",
  },
  {
    value: "18:00",
    title: "06:00 PM",
  },
  {
    value: "18:30",
    title: "06:30 PM",
  },
  {
    value: "19:00",
    title: "07:00 PM",
  },
  {
    value: "19:30",
    title: "07:30 PM",
  },
  {
    value: "20:00",
    title: "08:00 PM",
  },
  {
    value: "20:30",
    title: "08:30 PM",
  },
  {
    value: "21:00",
    title: "09:00 PM",
  },
  {
    value: "21:30",
    title: "09:30 PM",
  },
  {
    value: "22:00",
    title: "10:00 PM",
  },
  {
    value: "22:30",
    title: "10:30 PM",
  },
  {
    value: "23:00",
    title: "11:00 PM",
  },
  {
    value: "23:30",
    title: "11:30 PM",
  },
];
