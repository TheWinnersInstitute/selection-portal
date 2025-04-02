import AWS from "aws-sdk";
import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import { toSnakeCase } from "./google";
import { CronJob } from "cron";
import { prisma } from "./db";
import fs from "fs";
import path from "path";

export class S3 {
  private static _instance: S3;
  public s3: AWS.S3;
  public uploadFile: multer.Multer;
  public uploadResult: multer.Multer;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    this.uploadFile = multer({
      storage: multerS3({
        s3: new S3Client({
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
          },
          region: process.env.AWS_REGION,
        }),
        bucket: process.env.AWS_S3_BUCKET as string,
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
          cb(
            null,
            `student-profiles/${Date.now()}_${toSnakeCase(file.originalname)}`
          );
        },
      }),
    });
    this.uploadResult = multer({
      storage: multerS3({
        s3: new S3Client({
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
          },
          region: process.env.AWS_REGION,
        }),
        bucket: process.env.AWS_S3_BUCKET as string,
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
          cb(
            null,
            `student-results/${Date.now()}_${toSnakeCase(file.originalname)}`
          );
        },
      }),
    });
  }

  backup() {
    new CronJob("0 0 * * *", async () => {
      console.log("Running cron job", new Date().toString());
      try {
        const boards = await prisma.board.findMany();
        const exams = await prisma.exam.findMany();
        const students = await prisma.student.findMany();
        const assets = await prisma.asset.findMany();
        const enrollments = await prisma.enrollment.findMany();

        const data = {
          boards,
          exams,
          students: students.map((student) => ({
            ...student,
            contactNumber: student.contactNumber.toString(),
          })),
          assets,
          enrollments: enrollments.map((enrollment) => ({
            ...enrollment,
            rollNumber: enrollment.rollNumber.toString(),
          })),
        };

        const jsonData = JSON.stringify(data, null, 2);

        const filePath = path.join(__dirname, "../../assets/backup.json");
        fs.writeFileSync(filePath, jsonData, "utf8");

        await this.s3
          .upload({
            Bucket: process.env.AWS_S3_BUCKET as string,
            Key: "backup.json",
            Body: fs.createReadStream(filePath),
            ContentType: "application/json",
          })
          .promise();

        fs.unlinkSync(filePath);
      } catch (error) {
        console.log(error);
        console.log("CRON JOB FAILED");
      }
    }).start();
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }
}

export const studentBulkUpload = multer({ dest: "assets/" });
