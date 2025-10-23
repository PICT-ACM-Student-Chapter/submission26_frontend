// import AWS from 'aws-sdk'
// import apiConfig from '../configs/api'

// AWS.config.update({
//     accessKeyId: process.env.accessKey,
//     secretAccessKey:  process.env.secretAccessKey,
//     region: 'ap-south-1'  
// })

// export default AWS;

import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION
});

export default AWS;
