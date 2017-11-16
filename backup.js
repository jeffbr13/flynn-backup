const AWS = require("aws-sdk");
const UploadStream = require("s3-stream-upload");
const got = require('got');
const iso8601 = require('iso8601');


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";     // don't check Flynn controller self-signed certificates
const url = 'https://' + process.env.FLYNN_ENDPOINT + '/backup';
const backup_file_key = 'flynn-backup-' + iso8601.fromDate(new Date()) + '.tar';
const destination_url = `https://${process.env.S3_BUCKET_NAME}.${process.env.S3_ENDPOINT}/${backup_file_key}`;

const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint(process.env.S3_ENDPOINT),
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_ACCESS_KEY_SECRET,
});


console.log(`Backing up Flynn from <${url}>…`);
got.stream(url, {auth: ':' + process.env.FLYNN_TOKEN})
    .pipe(UploadStream(s3, {Bucket: process.env.S3_BUCKET_NAME, Key: backup_file_key}))
    .on("error", function (err) {
        console.error(err);
    })
    .on("finish", function () {
        console.log(`Uploaded backup to <${destination_url}>!`);
    });
