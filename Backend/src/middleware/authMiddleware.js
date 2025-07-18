const jwt = require('jsonwebtoken');
const Users = require('../model/Users');
const  authMiddleware =  {   
    protect : async ( req, res, next ) => {
        const token = req.cookies?.jwtToken ;

        
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
            // console.log("user from auth middleware", user);
            const userId = user.id || user.userDetails?.id;

            if(user){
                req.user = await Users.findById(userId);
                
            }else{
                return res.status(401).json({ message: 'invalid token' });
            }
          
            next();
        } catch (err) {
            console.error(err);
            return res.status(403).json({ message: 'Forbidden' });
        }
    }
}

module.exports = authMiddleware;