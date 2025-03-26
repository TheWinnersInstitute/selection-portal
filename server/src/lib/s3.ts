import AWS from "aws-sdk";
import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";

export class S3 {
  private static _instance: S3;
  public s3: AWS.S3;
  public uploadFile: multer.Multer;

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
          cb(null, `student-portal/${Date.now()}_${file.originalname}`);
        },
      }),
    });
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }
}

export const studentBulkUpload = multer({ dest: "assets/" });
