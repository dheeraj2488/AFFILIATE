const jwt = require('jsonwebtoken');
const  authMiddleware =  {   
    protect : async ( req, res, next ) => {
        const token = req.cookies?.jwtToken ;

        
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
            // console.log("user from auth middleware", user);
            req.user = user;
            next();
        } catch (err) {
            console.error(err);
            return res.status(403).json({ message: 'Forbidden' });
        }
    }
}

module.exports = authMiddleware;