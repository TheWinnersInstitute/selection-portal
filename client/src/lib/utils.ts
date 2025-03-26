import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getBase64Image(
  url: string,
  type: string
): Promise<string> {
  const response = await fetch(url, { mode: "no-cors" });
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      }
    };
    reader.readAsDataURL(blob);
  });

  // return new Promise((resolve, reject) => {
  //   const img = new Image();
  //   img.width = 100;
  //   img.height = 100;
  //   // img.crossOrigin = "anonymous"; // Bypass CORS
  //   img.src = url;

  //   img.onload = () => {
  //     resolve(img);
  //   };

  //   img.onerror = reject;
  // });
}
