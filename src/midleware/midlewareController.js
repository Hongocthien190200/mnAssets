const jwt = require("jsonwebtoken");

const midlewareController = {
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json("Token is not valid");
                }
                else{            
                    req.user = user;
                    next();
                }
            })
        }
        else {
            return res.status(401).json("You're not authenticated");
        }
    },
    verifyTokenAndAdminAuth: (req, res, next) => {
        midlewareController.verifyToken(req, res, () => {                                                                                                           
            if (req.user.admin) {
                next();
            } else {
                return res.status(403).json("You're not allowed");
            }
        });
    }
}
module.exports = midlewareController;