// import AWS from "./awsClient";
// import { v4 as uuidv4 } from "uuid";

// // bucket_name=submission-pulzion-24
// // region=ap-south-1
// export const uploadFile = async (file) => {
//   const id = uuidv4();

//   var upload = new AWS.S3.ManagedUpload({
//     params: {
//       Bucket: "submission-platform-files-2025",
//       Key: `${id}_${file.name}`,
//       Body: file,
//     },
//     region: "ap-south-1",
//   });
//   try {
//     const res = await upload.promise();
//     console.log("upload: ",res);
//     if (res?.Location) {
//       return { submission: res.Location };
//     }
//     return {
//       error: "Something went wrong",
//     };
//   } catch (e) {
//     return {
//       error: "Something went wrong",
//     };
//   }
// };



import AWS from "./awsClient";
import { v4 as uuidv4 } from "uuid";

// Make sure your awsClient already sets region correctly
export const uploadFile = async (file) => {
  const id = uuidv4();
  const bucket =
    process.env.NEXT_PUBLIC_AWS_S3_BUCKET || "pulzion-submissions-bucket";
  const region = process.env.NEXT_PUBLIC_AWS_REGION || "ap-south-1";

  const key = `submission/${id}_${file.name}`;

  try {
    const s3 = new AWS.S3({
      region: region,
      signatureVersion: "v4",
    });

    const upload = new AWS.S3.ManagedUpload({
      service: s3,
      params: {
        Bucket: bucket,
        Key: key,
        Body: file,
      },
    });

    const res = await upload.promise();
    console.log("upload: ", res);

    if (res?.Location) {
      return { submission: res.Location };
    }

    return { error: "Something went wrong" };
  } catch (e) {
    console.error("S3 Upload Error:", e);
    return { error: "Something went wrong" };
  }
};
