const AWS = require("aws-sdk");
const got = require('got');
const iso8601 = require('iso8601');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";     // don't check Flynn controller self-signed certificates
const url = 'https://' + process.env.FLYNN_CONTROLLER_ENDPOINT + '/backup';
let bucket_path = process.env.S3_BUCKET_PATH || '/';
// ensure `/` at beginning and end of bucket_path.
if (!bucket_path.startsWith('/')) bucket_path = '/' + bucket_path;
if (!bucket_path.endsWith('/')) bucket_path = bucket_path + '/';
const backup_file_key = bucket_path + 'flynn-backup-' + iso8601.fromDate(new Date()) + '.tar';
const destination_url = `https://${process.env.S3_BUCKET}.${process.env.S3_ENDPOINT}${backup_file_key}`;

const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint(process.env.S3_ENDPOINT),
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_ACCESS_KEY_SECRET,
});


console.log(`Backing up Flynn from <${url}>…`);

const backup_file_stream = got.stream(url, {auth: ':' + process.env.FLYNN_CONTROLLER_KEY});
s3.upload({
        Bucket: process.env.S3_BUCKET,
        Key: backup_file_key,
        Body: backup_file_stream,
    },
    function (err, data) {
        console.log(err, data);
});
