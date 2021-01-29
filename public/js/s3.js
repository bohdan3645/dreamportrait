(function () {
  const BUCKET_NAME = 'dream-portrait';
  const BUCKET_REGION = "eu-central-1";
  const IDENTITY_POOL_ID = "eu-central-1:a0491302-21db-4ea2-8d26-d2b400509520";

  AWS.config.update({
    region: BUCKET_REGION,
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: IDENTITY_POOL_ID
    })
  });

  window.s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: { Bucket: BUCKET_NAME }
  });
})()
