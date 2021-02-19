const AWS = require('aws-sdk');

AWS.config.update({ region: 'eu-central-1' });

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const BUCKET_NAME = 'dream-portrait'

function removeObject (url) {
  const key = new URL(url).pathname.substring(1)
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  return new Promise((resolve, reject) => {
    s3.deleteObject(params, (err, result) => {
      if (err) return reject(err);

      resolve(result)
    });
  })
}

module.exports.removeObject = removeObject
