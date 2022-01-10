const express = require("express");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

//setting up body parser and static folder
app.use(express.urlencoded({ extended: true }));
app.use(express.static("assets"));

//setting up mailchimp authentication
mailchimp.setConfig({
    apiKey: "", //enter API key
    server: "", //enter server
});

//send sign up page on website request
app.get('/', function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

//send post after user submit form
app.post('/', function(req, res) {

    const listID = ""; //enter listID
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    //store the information as properties into a variable
    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    }

    //upload data to server
    async function run() {
        const response = await mailchimp.lists.addListMember(listID, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        });

        //respond with success.html upon success
        res.sendFile(__dirname + "/success.html")
        console.log("Successfully registered contact.");
    };

    //send failure.html when any error is caught
    run().catch(e => res.sendFile(__dirname + "/failure.html"));
    console.log("Fail to registered contact.");
});

//listen to check if port 3000 is up
app.listen(process.env.PORT || 3000, function() {
    console.log("Server is up on Port:3000");
});
