import { Request, Response } from "express";
import xlsx from "xlsx";
import { errorResponse, prisma } from "../../../lib";

export async function downloadLuckyDrawWinnersExcel(
  req: Request,
  res: Response
) {
  try {
    const { luckyDrawId } = req.params;
    const luckyDrawWinners = await prisma.luckyDrawParticipant.findMany({
      where: {
        isWinner: true,
        luckyDrawId,
      },
      include: {
        reward: true,
      },
    });
    const jsonData = luckyDrawWinners.map((luckyDrawWinner, index) => {
      return {
        "S.no.": index + 1,
        Name: luckyDrawWinner.name,
        Email: luckyDrawWinner.email || "",
        MobileNumber: luckyDrawWinner.phone,
        Reward: luckyDrawWinner.reward?.name || "-",
      };
    });
    if (jsonData.length === 0) {
      res.setHeader("Content-Type", "application/json");
      res.status(400).json({
        message: "No students data available",
      });
      return;
    }
    const worksheet = xlsx.utils.json_to_sheet(jsonData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Errored Data");

    const excelBuffer = xlsx.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="students-data.xlsx"'
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(excelBuffer);
  } catch (error) {
    errorResponse(res, error);
  }
}
