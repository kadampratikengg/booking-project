// src/config/aws.js
import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "ap-south-1",
});

// S3 Instance
export const s3 = new AWS.S3();

// S3 Upload Function
export const uploadToS3 = async (fileBuffer, fileName, mimeType, folder = "uploads") => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `${folder}/${Date.now()}-${fileName}`,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: "public-read", // Or "private" if you don’t want public URLs
    };

    const uploaded = await s3.upload(params).promise();

    return {
      url: uploaded.Location,
      key: uploaded.Key,
    };
  } catch (error) {
    console.error("S3 Upload Error:", error);
    throw new Error("Error uploading file to S3");
  }
};

// S3 Delete Function
export const deleteFromS3 = async (key) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    };

    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    console.error("S3 Delete Error:", error);
    return false;
  }
};
