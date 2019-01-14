// (function() {
//     // All Vue code goes in here
//
//     new Vue({
//         el: "#main", //el = element. Referring to an element in html with an id of "main". The logic of the javascript file will be injected into this element
//         data: {
//             // data is all the information that you want to render, e.g. images etc.
//             header: "my first vue app <3",
//             lunch: "himali",
//             pokemon: [
//                 "psyduck",
//                 "snorlex",
//                 "jigglypuff",
//                 "ursaring",
//                 "ditto",
//                 "pikachu"
//             ],
//
//             cuteAnimals: [
//                 {
//                     name: "Baby Sloth",
//                     cuteScore: "very cute"
//                 },
//                 {
//                     name: "Wombat",
//                     cuteScore: "ultra cute"
//                 },
//                 {
//                     name: "Puppy",
//                     cuteScore: "out of this world cute"
//                 }
//             ],
//             imageSrc:
//                 "https://s3.amazonaws.com/spicedling/jAVZmnxnZ-U95ap2-PLliFFF7TO0KqZm.jpg",
//             integer: 1,
//             pokemonArray: []
//         },
//         mounted: function() {
//             console.log("this:", this); // in this case, "this" is referring to "Vue" and Vue includes the pokemonArray
//             var self = this; // Storing "this" in a varbiable when it still refers to "Vue"
//             // Runs after page loaded. Similar to document.ready in Vanilla JS
//             // Mounted is e.g. a great place to make requests to our server.
//             console.log("mounted running!");
//             // make GET request to server
//             // GET /get-pokemon
//             // script.js is Frontend
//             axios.get("/get-pokemon").then(function(response) {
//                 console.log("this.pokemonArray", this.pokemonArray); // return undefined
//
//                 console.log("response", response.data);
//                 var pokemonArrayFromServer = response.data; // We usually only care about the "data" key in the object returned from res.json
//
//                 self.pokemonArray = pokemonArrayFromServer;
//                 console.log("self:", self.pokemonArray);
//             }); // axios is used to make the frontend and backend talk to each other.
//         }
//     });
// })();
