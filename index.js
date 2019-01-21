const express = require("express");
const app = express();
const db = require("./db");
const config = require("./config");
app.use(express.static("./public"));
const s3 = require("./s3");

// Boilerplate code - Do not change
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            // uidSafe takes the image name and makes it into a 24 character unique name.
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152 // Files you upload cannot be greater than 2MB
    }
});

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    let s3Url = config.s3Url + req.file.filename;
    if (req.file) {
        db.uploadImages(
            s3Url,
            req.body.description,
            req.body.title,
            req.body.username
        )
            .then(function(results) {
                res.json({
                    data: results
                });
            })
            .catch(function(err) {
                console.log("error in app.post", err);
            }); //file,description,title, username
    } else {
        res.json({
            success: false
        });
    }
});

// Regular Server Paths
app.get("/get-images", (req, res) => {
    db.getImages()
        .then(function(results) {
            res.json(results.rows);
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.get("/image/:id", (req, res) => {
    db.getImageById(req.params.id)
        .then(function(results) {
            res.json(results);
        })
        .catch(function(err) {
            console.log("error in app.get /image/:id", err);
        });
});

app.post("/comments", function(req, res) {
    db.uploadComments(req.body.comment, req.body.username, req.body.imageId)
        .then(function(results) {
            res.json(results.rows);
        })
        .catch(function(err) {
            console.log("error in app.post /comments", err);
        });
});

app.get("/get-more-images/:id", (req, res) => {
    var lastId = req.params.id;
    db.getMoreImages(lastId).then(images => {
        res.json(images);
    });
});

app.post("/completed-Component", (req, res) => {
    db.updateCompletion(req.body.imageId, req.body.completedComponent)
        .then(function(results) {
            res.json(results);
        })
        .catch(function(err) {
            console.log("error in app.post /completed-Component", err);
        });
});

app.get("/components-completed", (req, res) => {
    db.getCompletion()
        .then(function(results) {
            res.json(results);
        })
        .catch(function(err) {
            console.log("error in app.post /components-completed", err);
        });
});

app.listen(8080, () => console.log("I'm listening"));
