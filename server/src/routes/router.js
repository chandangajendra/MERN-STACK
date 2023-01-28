const express = require('express');
const router = express.Router();
const app = express();
const user = require("../schema/userSchema");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
var bcrypt = require('bcryptjs');
const authenticate = require("../middileware/authenticate");



// middlewares 
app.use(cookieParser());



// creating a new user 
router.post('/signin', async (req, res) => {
    try {
        const findingUser = await user.findOne({ email: req.body.email })
        if (findingUser) {
            res.status(422).send("User with these email already exists")
        } else {
            if (req.body.pass === req.body.confpass) {
                const filling = new user({
                    name: req.body.name,
                    email: req.body.email,
                    mobile: req.body.mobile,
                    work: req.body.work,
                    pass: req.body.pass,
                });

                const filled = await filling.save();
                res.json(filled).status(201)
            }
            else {
                res.json("password and confirm password is not matching").status(422)
            }
        }

    } catch (err) {
        res.sendStatus(501).json("some error occured please see console for error details")
        console.log(err);
    }

})


// Login in a user 
router.post("/login", async (req, res) => {
    try {

        if (!req.body.email || !req.body.pass) {
            res.status(401).json("Please fill the email and pass field")
        }
        else {
            // comparing a user 
            const email = req.body.email;
            const loginDetails = await user.findOne({ email });
            const isMatch = await bcrypt.compare(req.body.pass, loginDetails.pass);

            if (isMatch) {
                const token = await loginDetails.generateAuthToken();
                res.cookie("jsonwebtoken", token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                });
                res.status(215).json(
                    {
                        "status": 215,
                        "response": "server login succesfully"
                    })
            }
            else {
                res.sendStatus(400).json("error")
            }
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(501)
    }
})


// about  page authentication
router.get("/about", authenticate, (req, res) => {
    res.send(req.rootUser)
})

// contact  page  authentication
router.post("/contact", authenticate, async (req, res) => {
    try {
        const { name, email, mobile, messege } = req.body;
        // if (!name || !email || !mobile || !messege) {
        if (false) {
            console.log("inside if statement");
            return res.json({ msg: "please fill all the field " });
        }
        else {
            const contactUser = await user.findOne({ _id: req.userID });
            if (contactUser) {
                const userMessege = await contactUser.addMessege(name, email, mobile, messege)
                await contactUser.save();
                return res.status(201).json({ messege: " messege saved sucessfully" })
            }
        }
    } catch (err) {
        console.log("these error is from backend " + err);
    }
})

// Logout page 
router.get("/logout", (req, res) => {
    res.clearCookie("jsonwebtoken", { path: "/" });
    res.send("logout sucessfull").status(200);
});

module.exports = router;