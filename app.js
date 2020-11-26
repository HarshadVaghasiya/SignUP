const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/failure", function (req, res) {
    res.redirect("/")
});

app.post("/success", function (req, res) {
    res.redirect("/");
});

app.post("/", function (req, res) {
    const firstname = req.body.firstName;
    const lastname = req.body.lastName;
    const email = req.body.email;
    console.log(firstname);

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstname,
                LNAME: lastname
            }
        }
        ]
    }
    const jsonData = JSON.stringify(data);

    const url = "https://us7.api.mailchimp.com/3.0/lists/9e1ff2c86b";
    const options = {
        method: "POST",
        auth: "hello:f4589200b2195f5a95d0e44a049016c9-us7"
    };
    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();


});

app.listen(process.env.PORT || 3000, function () {
    console.log("server started listen at port 3000");
});


// mailchimp API key
// f4589200b2195f5a95d0e44a049016c9-us7

// mailchimp audience Id
// 9e1ff2c86b