flynn-backup
============

Flynn app to backup your cluster to an S3-compatible blobstore.


Usage
-----

Create a new app on your Flynn cluster with the following environment variables:

- `S3_ENDPOINT`: the API endpoint for your S3-compatible storage,
  e.g. `"s3.amazonaws.com"` or `"ams3.digitaloceanspaces.com"`.
- `S3_BUCKET`: your S3 bucket name.
- `S3_BUCKET_PATH`: bucket subdirectory to place backups in. Defaults to `/`.
- `S3_ACCESS_KEY_ID`
- `S3_ACCESS_KEY_SECRET` 
- `FLYNN_CONTROLLER_ENDPOINT`: [Flynn Controller](https://flynn.io/docs/api/controller) endpoint.
- `FLYNN_CONTROLLER_KEY`: Flynn Controller auth key. Find this by running `flynn -a controller env get AUTH_KEY`.
- `BACKUP_INTERVAL`: seconds between backups. Defaults to `86400` (24 hours).
