const express = require("express");
const app = express();
const db = require("./db");
const config = require("./config");
app.use(express.static("./public"));
const s3 = require("./s3");

// Boilerplate code  Do Not Touch!
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
    // If nothing went wrong the file is already in the uploads directory
    let s3Url = config.s3Url + req.file.filename;
    // console.log("s3.upload", s3.upload);
    // console.log("s3Url", s3Url);
    if (req.file) {
        db.uploadImages(
            s3Url,
            req.body.description,
            req.body.title,
            req.body.username
        )
            .then(function(results) {
                // console.log("results in app.post.then", results);
                res.json({
                    data: results
                });
            })
            .catch(function(err) {
                console.log("error in app.post", err);
            }); //file,description,title, username
        // console.log("req.file", req.file);
        // console.log("req.body", req.body);
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
            // console.log("results", results);
            res.json(results.rows);
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.get("/image/:id", (req, res) => {
    db.getImageById(req.params.id)
        .then(function(results) {
            // console.log("results", results);
            res.json(results);
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.post("/comments", function(req, res) {
    console.log("req in app.post /comments", req.body);

    db.uploadComments(req.body.comment, req.body.username, req.body.imageId)
        .then(function(results) {
            // console.log("results in app.post.then", results);
            res.json(results.rows);
        })
        .catch(function(err) {
            console.log("error in app.post", err);
        });
});

app.get("/get-more-images/:id", (req, res) => {
    // console.log("req.params.id", req.params.id);
    var lastId = req.params.id;
    db.getMoreImages(lastId).then(images => {
        // console.log("images in the get more images", images);
        res.json(images);
    });
});

app.post("/completed-Component", (req, res) => {
    console.log("req in app.post /completed-Component", req.body);
    db.updateCompletion(req.body.imageId, req.body.completedComponent)
        .then(function(results) {
            console.log("results in /completed-Component", results);
            res.json(results);
        })
        .catch(function(err) {
            console.log("error in app.post", err);
        });
});

app.get("/components-completed", (req, res) => {
    console.log("req in app.get /component-completed", req.body);
    db.getCompletion()
        .then(function(results) {
            console.log("results in app.get /component-completed:", results);
            res.json(results);
        })
        .catch(function(err) {
            console.log("error in app.post", err);
        });
});

app.listen(8080, () => console.log("I'm listening"));
