const AWS = require("aws-sdk");
const UploadStream = require("s3-stream-upload");
const got = require('got');
const iso8601 = require('iso8601');
const progress = require('progress-stream');


const backup_name = 'flynn-backup-' + iso8601.fromDate(new Date()) + '.tar';
const endpoint = new AWS.Endpoint(process.env.S3_ENDPOINT);
const s3 = new AWS.S3({
    endpoint: endpoint,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_ACCESS_KEY_SECRET,
});

// Flynn controller certificates are self-signed
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


const progress_stream = progress({time: 100 /* ms */}, function (progress) {
    console.log('down', progress);
});


got.stream('https://' + process.env.FLYNN_ENDPOINT + '/backup', {auth: ':' + process.env.FLYNN_TOKEN})
    .pipe(progress_stream)
    .pipe(UploadStream(s3, {Bucket: process.env.S3_BUCKET_NAME, Key: backup_name}))
    .on("error", function (err) {
        console.error(err);
    })
    .on("finish", function () {
        console.log("File uploaded!");
    });
