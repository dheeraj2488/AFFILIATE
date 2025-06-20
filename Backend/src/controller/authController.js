const jwt = require('jsonwebtoken');
const authController = {
    login : (req , res) =>{
         // these values are here becuase of express.json() middleware
        const { username , password } = req.body;

        if(username == 'admin' && password == 'admin'){

            const userDetails = {
                name : "dheeraj",
                email : "dheeraj.com"
            }

            const token  = jwt.sign({userDetails} , process.env.JWT_SECRET_KEY, {  expiresIn : '1h' });
            res.cookie('jwtToken',token,{//key and value and configuration
                httpOnly: true,//only server can change the details
                secure:true,//will only be accesible on https 
                domain:'localhost',// specified domain
                path:'/'//available on which path on the browser ,here it is available for all pages
            });
            res.json({message:'User authenticated',userDetails: userDetails});

        }else{
             res.status(401).json({ message : 'Invalid Credentials' });
        }

        
    } ,
    logout:(req,res)=>{
        res.clearCookie('jwtToken');
        res.json({message:'User logged out successfully'});
    },
    isUserLoggedIn:(request,response)=>{
        const token=request.cookies.jwtToken;
        if(!token){
            return response.status(401).json({message:'Unauthorized access'});
        }
        jwt.verify(token,process.env.JWT_SECRET_KEY,(error,decodedSecret)=>{
            if(error){
                return response.status(401).json({message:'Unauthorized access'});
            }
            else{
                return response.json({userDetails : decodedSecret});
            }
        });
    },
};


module.exports=authController;