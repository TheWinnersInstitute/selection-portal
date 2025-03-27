import IORedis from "ioredis";
import { Queue, Worker } from "bullmq";
import { prisma } from "./db";
import { uploadDriveFileToS3 } from "./google";
import fs from "fs";
import path from "path";
import { camelCase } from "lodash";

export class RedisClient {
  private static _instance: RedisClient;
  public redisClient: IORedis;
  public queue: Queue;
  public queueLength: number;

  private constructor() {
    console.log(__dirname);
    this.redisClient = new IORedis({
      host: process.env.REDIS_HOST as string,
      password: process.env.REDIS_PASSWORD as string,
      maxRetriesPerRequest: null,
    });
    this.queue = new Queue(process.env.REDIS_QUEUE as string, {
      connection: this.redisClient,
    });
    this.worker();
    this.queueLength = 0;
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  async addToQueue(data: any) {
    this.queueLength++;
    await this.queue.add("create-student", data);
  }

  worker() {
    const worker = new Worker(
      process.env.REDIS_QUEUE as string,
      async (job) => {
        const { row, exams } = job.data;
        try {
          const shapedObject = {} as { [key: string]: any };
          Object.keys(row).forEach((key) => {
            const updatedKey = camelCase(key);
            shapedObject[updatedKey] = row[key];
          });
          const {
            examName,
            mobileNumber,
            name,
            photo,
            post,
            resultPdf,
            rollNumber,
          } = shapedObject;

          let student = await prisma.student.findUnique({
            where: {
              name_contactNumber: {
                name,
                contactNumber: parseInt(mobileNumber, 10),
              },
            },
          });

          let profileId: string | undefined;
          let resultId: string | undefined;
          if (!student) {
            student = await prisma.student.create({
              data: {
                name,
                contactNumber: parseInt(mobileNumber, 10),
                imageId: profileId,
              },
            });
          }
          if (student && !student.imageId && photo) {
            profileId = await uploadDriveFileToS3(photo, "student-profiles");
          }

          if (exams[examName]) {
            let enrollment = await prisma.enrollment.findUnique({
              where: {
                rollNumber_examId: {
                  examId: exams[examName],
                  rollNumber: parseInt(rollNumber, 10),
                },
              },
            });
            if (!enrollment) {
              enrollment = await prisma.enrollment.create({
                data: {
                  rollNumber: parseInt(rollNumber, 10),
                  examId: exams[examName],
                  post,
                  resultId: resultId,
                  studentId: student.id,
                },
              });
              if (enrollment && !enrollment.resultId && resultPdf)
                resultId = await uploadDriveFileToS3(
                  resultPdf,
                  "student-results"
                );
            }
          } else {
            logger({
              ...row,
              Message: "Exam not found",
            });
          }
        } catch (error) {
          console.log(error);
          logger({
            ...row,
            Message:
              error instanceof Error ? error.message : "Something went wrong",
          });
        }
        this.queueLength--;
      },
      {
        connection: this.redisClient,
      }
    );
    worker.on("completed", (job) => {
      console.log(job.id, "Completed");
    });
  }
}

const logger = async (data: any) => {
  try {
    const tempFilePath = path.join(__dirname, "../../assets/errors.json");
    const jsonData = JSON.parse(fs.readFileSync(tempFilePath, "utf8"));
    jsonData.students.push(data);
    fs.writeFileSync(tempFilePath, JSON.stringify(jsonData, null, 2), "utf8");
  } catch (error) {
    console.log("error while logging", error);
  }
};
