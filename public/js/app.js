(function() {
    Vue.component("some-component", {
        template: "#my-template",
        props: ["imageId"],

        data: function() {
            return {
                created_at: new Date(""),
                description: "",
                id: "",
                title: "",
                url: "",
                username: "",
                comments: [],
                completedComponent: false,
                form: {
                    comment: "",
                    usernametwo: ""
                }
            };
        },
        watch: {
            imageId: function() {
                console.log("watcher running", this.imageId);
            }
        },
        mounted: function() {
            var self = this;
            console.log("this.comments", this.comments);
            axios.get(`/image/${this.imageId}`).then(function(response) {
                var newDate = response.data.rows[0].created_at.replace(
                    /\T.*/,
                    ""
                );
                self.created_at = newDate;
                self.description = response.data.rows[0].description;
                self.id = response.data.rows[0].id;
                self.title = response.data.rows[0].title;
                self.url = response.data.rows[0].url;
                self.username = response.data.rows[0].username;
                self.comments = response.data.rows;
                console.log("response.data.rows;", response.data.rows);
            });
        },
        methods: {
            handleClick: function() {
                console.log("clicked!");
            },
            closeComponent: function() {
                console.log("x clicked");
                this.$emit("close-the-component");
            },

            uploadComment: function(e) {
                e.preventDefault();
                var self = this;
                var data = {};
                data["comment"] = this.form.comment;
                data["usernametwo"] = this.form.usernametwo;
                data["imageId"] = this.id;

                axios
                    .post("/comments", {
                        comment: self.form.comment,
                        username: self.form.usernametwo,
                        imageId: self.imageId
                    })
                    .then(function(response) {
                        console.log("response in axios.post", response.data);

                        self.comments.unshift(response.data[0]);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            },

            updateModal: function(e) {
                // e.preventDefault();
                this.completedComponent = true;
                this.$emit("completed-the-component");

                axios
                    .post("/completed-Component", {
                        completedComponent: true,
                        imageId: self.imageId
                    })
                    .then(function(response) {
                        console.log(
                            "response in axios.post completedComponent",
                            response
                        );
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            }
        }
    });

    new Vue({
        el: "#main",
        data: {

            images: [],
            showComponent: false,
            form: {
                title: "",
                description: "",
                username: "",
                file: null
            },
            imageId: location.hash.slice(1) || 0,
            showButton: true
        },

        mounted: function() {
            var self = this;

            axios.get("/get-images").then(function(response) {
                var imagesFromServer = response.data;
                self.images = imagesFromServer;
            });

            window.addEventListener("hashchange", function() {
                self.imageId = location.hash.slice(1);
            });
        },
        methods: {
            closingTheComponent: function() {
                this.imageId = null;
            },

            submit: function() {
                console.log("submit clicked!");
            },

            completingTheComponent: function() {
                var self = this;
                axios.get("/components-completed").then(function(response) {
                    self.images.push.apply(self.images, response.data);

                });
            },

            resizeModal: function(e) {
                this.ShowCompontent = true;
                this.imageId = e.target.id;
            },

            handleFileChange: function(e) {
                this.form.file = e.target.files[0];
            },

            uploadFile: function(e) {
                e.preventDefault();
                var self = this;
                var formData = new FormData();
                formData.append("file", this.form.file);
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);

                axios.post("/upload", formData).then(function(response) {
                    var imagesFromS3 = response.data.data.rows[0];
                    self.images.push(imagesFromS3);
                });
            },
            getMoreImages: function(e) {
                console.log("hide button launched");
                var lastId = this.images[this.images.length - 1].id;
                var self = this;
                axios
                    .get("/get-more-images/" + lastId)
                    .then(function(response) {
                        if (response.data.length < 1) {
                            self.showButton = false;
                        }
                        self.images.push.apply(self.images, response.data); 
                    });
            }
        }
    });
})();
