const jwt = require('jsonwebtoken');
const user = require("../schema/userSchema");
const authenticate = async (req, res, next) => {
    try {

        const token = req.rawHeaders[9].substr(13);

        // jwt malformed error  not resolved
        const verifyToken = await jwt.verify(token, process.env.SECRET);
        const rootUser = await user.findOne({ _id: verifyToken._id, "tokens.token": token });
        if (!rootUser) {
            throw new Error("Error While finding user")
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;
        next()
    } catch (err) {
        // console.log(err);
        res.status(404).json("errror ocured");
    }
}

module.exports = authenticate;