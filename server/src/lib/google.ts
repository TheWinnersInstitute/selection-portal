import { google } from "googleapis";
import fs from "fs";
// import { s3 } from "./s3";
import { prisma } from "./db";
import { Response } from "express";
import path from "path";
import { S3 } from "./s3";

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "../../google-service.json"),
  scopes: ["https://www.googleapis.com/auth/drive"],
});

export const googleDrive = google.drive({ version: "v3", auth });

export const pipeFile = async (res: Response, url: string) => {
  const _url = new URL(url);
  const fileId = _url.searchParams.get("id");
  if (fileId) {
    const response = await googleDrive.files.get(
      { fileId },
      { responseType: "stream" }
    );

    res.setHeader("Content-Type", "application/octet-stream");
    response.data.pipe(res);
    return;
  }
  res.json({ message: "file now fount" });
};

export const uploadDriveFileToS3 = async (url: string): Promise<string> => {
  return new Promise(async (res, rej) => {
    const _url = new URL(url);
    const fileId = _url.searchParams.get("id");
    if (fileId) {
      const { data: fileMeta } = await googleDrive.files.get({
        fileId,
        fields: "name, mimeType",
      });
      const tempFilePath = path.join(__dirname, `../../assets/temp_${fileId}`);
      const dest = fs.createWriteStream(tempFilePath);
      const response = await googleDrive.files.get(
        { fileId, alt: "media" },
        { responseType: "stream" }
      );
      dest.on("finish", async () => {
        if (!fileMeta.name || !fileMeta.mimeType) {
          throw new Error(
            "File metadata is incomplete. Name or MIME type is missing."
          );
        }
        const s3Upload = await S3.instance.s3
          .upload({
            Bucket: process.env.AWS_S3_BUCKET as string,
            Key: `student-portal/${fileId}_${fileMeta.name}`,
            Body: fs.createReadStream(tempFilePath),
            ContentType: fileMeta.mimeType,
          })
          .promise();
        const asset = await prisma.asset.create({
          data: {
            path: s3Upload.Location,
            type: fileMeta.mimeType,
          },
        });
        fs.unlinkSync(tempFilePath);
        res(asset.id);
      });
      dest.on("error", rej);
      response.data.pipe(dest);
    }
  });
};
