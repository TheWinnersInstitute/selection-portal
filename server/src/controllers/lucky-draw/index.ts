export * from "./add";
export * from "./delete";
export * from "./get";
export * from "./get-all";
export * from "./update";
export * from "./confirm-winners";
export * from "./start";

export function formateDate(dateString: string) {
  const [fullDate, time] = dateString.split(", ");
  const [date, month, fullYear] = fullDate.split("/");
  const [hour, minute, second] = time.split(":");
  const formattedDate = new Date();
  formattedDate.setDate(parseInt(date, 10));
  formattedDate.setMonth(parseInt(month, 10));
  formattedDate.setFullYear(parseInt(fullYear, 10));
  formattedDate.setHours(parseInt(hour, 10));
  formattedDate.setMinutes(parseInt(minute, 10));
  formattedDate.setSeconds(0);
  return formattedDate;
}
