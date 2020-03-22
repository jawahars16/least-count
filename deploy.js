const AWS = require("aws-sdk")
const path = require("path")
const fs = require("fs")
const mime = require("mime")

const uploadDir = function(s3Path, bucketName) {

    let s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    function walkSync(currentDirPath, callback) {
        fs.readdirSync(currentDirPath).forEach(function(name) {
            const filePath = path.join(currentDirPath, name)
            const stat = fs.statSync(filePath)
            if (stat.isFile()) {
                callback(filePath, stat)
            } else if (stat.isDirectory()) {
                walkSync(filePath, callback)
            }
        })
    }

    walkSync(s3Path, function(filePath, stat) {
        let bucketPath = filePath.substring(s3Path.length + 1)
        let params = {
            Bucket: bucketName,
            Key: bucketPath,
            Body: fs.readFileSync(filePath),
            ContentType: mime.getType(filePath),
        }
        s3.upload(params, function(err, data) {
            if (err) {
                console.log(err)
            } else {
                console.log("Successfully uploaded " + bucketPath + " to " + bucketName)
            }
        })
    })
}

try {
    uploadDir("build", "least-count-game")
}
catch (e) {
    console.log(e)
    process.exit(1)
}