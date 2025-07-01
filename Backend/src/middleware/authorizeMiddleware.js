const permissions = require("../constants/permissions");

const authorize = (requiredPermission)=>{
    return (req, res, next) => {
        const user = req.user; // Assuming user is attached to the request object by previous middleware
        //authmiddleware will run before this middleware
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userPermissions = permissions[user.role] || [];

        if (!userPermissions.includes(requiredPermission)) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action' });
        }

        next();
    };
}

module.exports = authorize;