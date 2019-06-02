const fs = require("fs");
const AWS = require("aws-sdk");
require("dotenv").config();

class AWSS3 {
  constructor() {
    this.config = {
      apiVersion: "2006-03-01",
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      region: process.env.AWS_S3_REGION
    };

    this.s3 = new AWS.S3(this.config);
  }

  upload(filepath, name) {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(filepath)) {
        let fileBinaryString = fs.readFileSync(filepath, null);
        let params = {
          Body: fileBinaryString,
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          ACL:'public-read',
          Key: "img/" + name
        };

        this.s3.putObject(params, (e, d) => {
          if (e) {
            reject(e);
          }
          resolve(name);
        });
      } else {
        reject("File " + filepath + " does not exist");
      }
    });
  }
}
module.exports = new AWSS3();
