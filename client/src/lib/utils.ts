import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import startCase from "lodash/startCase";
import snakeCase from "lodash/snakeCase";

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
}

export async function studentPdf(students: Student[]) {
  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(18);
  doc.text("All Students Details", 14, 15);

  let startY = 25;

  const columns: { title: string; dataKey: keyof (typeof body)[0] }[] = [
    { title: "SR. No", dataKey: "srNo" },
    { title: "Name", dataKey: "name" },
    { title: "Date of Birth", dataKey: "dob" },
    { title: "Contact", dataKey: "contact" },
    { title: "Email", dataKey: "email" },
    { title: "Exam(s)", dataKey: "exam" },
    { title: "Post Allotment", dataKey: "postAllotment" },
  ];

  const body = students.map((student, index) => {
    const selections = student.Enrollment?.reduce(
      (prev, curr) => {
        const resultUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/assets/${curr.resultId}`;
        prev.name += prev.name ? `, ${curr.exam.name}` : curr.exam.name;
        prev.post += prev.post ? `, ${curr.post}` : curr.post;
        if (curr.resultId) {
          prev.result += prev.result ? `, ${resultUrl}` : resultUrl;
        }
        return prev;
      },
      {
        name: "",
        post: "",
        result: "",
      }
    );

    return {
      srNo: index + 1,
      name: student.imageId ? "" : student.name,
      dob: student.dateOfBirth
        ? new Date(student.dateOfBirth).toLocaleDateString()
        : "N/A",
      contact: student.contactNumber || "N/A",
      email: student.email || "N/A",
      exam: selections?.name ? "" : "N/A",
      postAllotment: selections?.post || "N/A",
    };
  });

  autoTable(doc, {
    startY: startY,
    head: [columns.map((col) => col.title)],
    body: body.map((row) =>
      columns.map((col) => row[col.dataKey as keyof typeof row])
    ),
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 6,
      halign: "center",
      valign: "middle",
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontSize: 12,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 40 },
      2: { cellWidth: 30 },
      3: { cellWidth: 40 },
      4: { cellWidth: 40 },
      5: { cellWidth: 50 },
      6: { cellWidth: 50 },
    },
    margin: { left: 14, right: 14 },
    didDrawCell: function (data) {
      if (data.section === "body") {
        const { column, row, cell } = data;
        const student = students[row.index];

        const xCenter = cell.x + cell.width / 2 - 10;

        if (column.index === 1 && student.name && student.imageId) {
          doc.setTextColor(0, 0, 255);
          // doc.addImage()
          doc.textWithLink(startCase(student.name), xCenter, cell.y + 6, {
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/admin/assets/${student.imageId}`,
          });
        }
        if (column.index === 5 && student.Enrollment) {
          doc.setTextColor(0, 0, 255);
          student.Enrollment.forEach((enrollment, index) => {
            const text =
              enrollment.exam.name +
              `${enrollment.selectionIn ? ` - ${enrollment.selectionIn}` : ""}`;
            if (enrollment.resultId) {
              doc.textWithLink(text, xCenter, cell.y + 6 + index * 5, {
                url: `${process.env.NEXT_PUBLIC_API_URL}/api/admin/assets/${enrollment.resultId}`,
                target: "_blank",
              });
            } else {
              doc.setTextColor(0, 0, 0);
              doc.text(text, xCenter, cell.y + 6 + index * 5, {});
            }
          });
        }
      }
    },
  });

  if (students.length === 1) {
    doc.save(`${snakeCase(students[0].name.toLowerCase())}.pdf`);
  } else {
    doc.save("all-students-details.pdf");
  }
}

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result && typeof reader.result === "string") {
        resolve(reader.result);
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};
