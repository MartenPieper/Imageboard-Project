(function() {
    // Arguments for components: 1. name of component 2. object
    Vue.component("some-component", {
        template: "#my-template", // We could use "<h1>My component is running!</h1>"
        props: ["imageId"], // "props" is always an array, even if just one item is included. You cannot include "data", but have to spell all of them out.

        data: function() {
            // Different from the Vue constructor, "Data" in component takes a function that returns an object.
            return {
                // heading: "catnip's first vue component"
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
                // get image and comments for new imadeId and put in data -> Same as in mounted function.
            }
        },
        mounted: function() {
            // console.log("component mounted");
            // console.log("this of Vue component", this);
            // console.log("this.imageId", this.imageId);
            var self = this;
            console.log("this.comments", this.comments);
            axios.get(`/image/${this.imageId}`).then(function(response) {
                // console.log("response:", response);
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
                // self.form.comment = response.data.rows[0].comment;
                self.comments = response.data.rows;
                // console.log("self.comments:", self.comments);
                console.log("response.data.rows;", response.data.rows);
                // console.log("newDate", newDate);
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
            // uploadComment: function() {
            //     console.log("Modal Load");
            // },

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
                        // console.log("self.comments", self.comments);
                        // console.log("self.images in uploadFile:", self.images);
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
        el: "#main", //el = element. Referring to an element in html with an id of "main". The logic of the javascript file will be injected into this element
        data: {
            // data is all the information that you want to render, e.g. images etc.

            images: [],
            showComponent: false,
            form: {
                title: "",
                description: "",
                username: "",
                file: null
            },
            // id of image that was clicked on
            // location.hash.slice[1] is just the number that is in the url- > makes URL shareable.
            imageId: location.hash.slice(1) || 0,
            showButton: true
            // completedComponent: []
        },

        mounted: function() {
            // console.log("this:", this); // in this case, "this" is referring to "Vue" and Vue includes the pokemonArray
            var self = this; // Storing "this" in a varbiable when it still refers to "Vue"
            // Runs after page loaded. Similar to document.ready in Vanilla JS
            // Mounted is e.g. a great place to make requests to our server.
            // console.log("mounted running!");

            axios.get("/get-images").then(function(response) {
                // console.log("response.data:", response.data);
                var imagesFromServer = response.data; // We usually only care about the "data" key in the object returned from res.json

                self.images = imagesFromServer;
                // console.log("self.images:", self.images);
            }); // axios is used to make the frontend and backend talk to each other.

            window.addEventListener("hashchange", function() {
                // location is the whole url, hash takes only the "#" + the following number, slice gets rid of the number.
                // console.log("Hash has changed", location.hash.slice(1));
                self.imageId = location.hash.slice(1);
                // check to make sure value that the user puts in the url actually corresponds to an images that EXISTS
                // ie if the user puts 12234224 after #, this shouldnt break your code.
            });
        },
        methods: {
            // Every function that response to an event happening goes into "method"
            // function that runs when user clicks submit button
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

                    // self.completedComponent.push(response.status);
                    console.log(
                        "response in completeingTheComponent",
                        response
                    );
                    console.log(
                        "self.completedComponent in completingTheComponent",
                        self.completetedComponent
                    );
                });
            },

            // hideButton: function() {
            //     this.showButton = false;
            //     console.log("hide button launched");
            // },
            //
            // resizeModal: function() {
            //     this.showComponent = true;
            // },

            resizeModal: function(e) {
                this.ShowCompontent = true;
                // console.log("e", e);
                this.imageId = e.target.id;
                // console.log("e.target.id", e.target.id);
                // console.log("this.imageId", this.imageId);
            },
            handleFileChange: function(e) {
                // console.log("e.target.files[0]", e.target.files[0]);
                this.form.file = e.target.files[0];
                // console.log("this.form", this.form);
            },

            uploadFile: function(e) {
                e.preventDefault();
                // console.log("this.form in uploadFile", this.form);
                var self = this;
                var formData = new FormData();
                formData.append("file", this.form.file);
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);

                axios.post("/upload", formData).then(function(response) {
                    // console.log("response in axios.post", response);
                    var imagesFromS3 = response.data.data.rows[0]; // We usually only care about the "data" key in the object returned from res.json

                    self.images.push(imagesFromS3);
                    console.log("self.images in uploadFile:", self.images);
                });
            },
            getMoreImages: function(e) {
                console.log("hide button launched");
                // this.showButton = false;
                // console.log("get more images running!");
                // console.log("All images", this.images);
                var lastId = this.images[this.images.length - 1].id;
                var self = this;
                // If lastId = 6 , the request will look like GET /get-more-images/6
                axios
                    .get("/get-more-images/" + lastId)
                    .then(function(response) {
                        if (response.data.length < 1) {
                            self.showButton = false;
                        }
                        // console.log("response in get-more-images", response);
                        self.images.push.apply(self.images, response.data); // .push.apply can combine two arrays
                    });
            }
        }
    });
})();
