const Links = require('../model/Links');
const Users = require('../model/Users');
const Clicks = require('../model/Clicks');
const axios = require('axios'); 
const { getDeviceInfo } = require("../util/linksUtility");
const { generateUploadSignature }  = require('../service/cloudinaryService');
const linksController = {

    create : async (req, res) => {

        console.log(req.body);

        const {campaignTitle, originalUrl, category ,thumbnail} = req.body;
        

        try {


            const user = await Users.findById({_id : req.user.id});
            console.log(user);

            if(user.credits >= 1 || user?.subscription?.status == 'active') {
                
                const link = new Links({
                    campaignTitle: campaignTitle, 
                    originalUrl: originalUrl,
                    category: category,
                    thumbnail: thumbnail,
                    user : req.user.role == 'admin' ? req.user.id : req.user.adminId, // if user is admin then he can create link for any user otherwise only for himself
                });
    
               if(user.credits >= 1 ) user.credits -= 1; // Decrement the user's credits by 1
    
                await user.save(); 
                await link.save();

                res.status(200).json({
                    data : {id : link._id , message : 'Link created successfully'},
                });
               
            }else{

                return res.status(400).json({
                    code : "INSUFFICENT_FUNDS",
                    message: "You don't have enough credits to create a link. Please purchase credits or subscribe to a plan."
                })
            }
            
            
            // console.log("credits of users" , user.credits)
            
        } catch (error) {
            console.log(error) ;
            return res.status(500).json({
                error : 'Internal server error'
            });
        }
    } , 

    getAll : async (req, res) => {
        try {

            const { 
                currentPage  = 0 , pageSize = 10,  // pagination
                searchTerm='', // searching 
                sortField = 'createdAt'  , sortOrder = 'desc' // sorting
            } =  req.query;

            const skip = parseInt(currentPage) * parseInt(pageSize);
            const limit = parseInt(pageSize);
            const sort = {[sortField]: sortOrder === 'asc' ? -1 : 1}; // sorting order - in mongo db 1 means ascending and -1 means descending order


            const userId =  req.user.role == 'admin' ? req.user.id : req.user.adminId; // if user is admin then he can get links of any user otherwise only his own links

            const query = {
                user : userId
            };
            
            if(searchTerm){
                //it is a javascript regex (regular expression ) function to search in title, category and originalUrl
                query.$or = [
                    { campaignTitle : new RegExp(searchTerm , 'i') }, // i represents case-insensitive search
                    { category: new RegExp(searchTerm , 'i') },
                    { originalUrl: new RegExp(searchTerm , 'i') }
                ];
            }
            const links = await Links.find(query).sort(sort).skip(skip).limit(limit);
            const total = await Links.countDocuments(query);

            return res.status(200).json({
                data: { links , total},
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: 'Internal server error',
            });
        }
    },
    getById : async (req, res) => {
        
        try {
            const linkId  = req.params.id;
            const userId = req.user.role == 'admin' ? req.user.id : req.user.adminId; // if user is admin then he can get links of any user otherwise only his own links

            if(!linkId){
                return res.status(400).json({
                    error: 'Link ID is required',
                });
            }


            const link = await Links.findById(linkId);

            if(!link) {
                return res.status(404).json({
                    error: 'Link not found',
                });
            }

            if (link.user.toString() !== userId) {
                return res.status(403).json({
                    error: 'unauthorized access',
                });
            }

            return res.status(200).json({
                data: link,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: 'Internal server error',
            });
        }
    },

    update : async (req, res) => {
        try {
            const linkId = req.params.id;
            const userId = req.user.role == 'admin' ? req.user.id : req.user.adminId;
            let link = await Links.findById(linkId);
            
            if (!link) {
                return res.status(404).json({
                    error: 'Link does not exist with the given id',
                });
            }

            if (link.user.toString() !== userId) {
                return res.status(403).json({
                    error: 'Unauthorized access',
                });
            }

            const { campaignTitle, originalUrl, category , thumbnail } = req.body;
            link = await Links.findByIdAndUpdate(linkId, {
                campaignTitle: campaignTitle,
                originalUrl: originalUrl, 
                category: category , 
                thumbnail: thumbnail
                
            }, {
                new: true, // Return the updated document
            })

            res.json({data : link});
           
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: 'Internal server error',
            });
        }
    } , 
    delete : async (req, res) => {
        try {
            const linkId = req.params.id;
            const userId = req.user.role == 'admin' ? req.user.id : req.user.adminId;

            let link = await Links.findById(linkId);

            if (!link) {
                return res.status(404).json({
                    error: 'Link does not exist with the given id',
                });
            }

            if (link.user.toString() !==userId) {
                return res.status(403).json({
                    error: 'Unauthorized access',
                });
            }

            await link.deleteOne();
            // console.log("Link deleted successfully");
            res.json({ message: 'Link deleted successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: 'Internal server error',
            });
        }
    }, 
    redirect : async (req, res) => {
       

        try {
            const linkId = req.params.id;

            if (!linkId) {
                return res.status(401).json({
                    error: 'Link ID is required',
                });
            }

            let link = await Links.findById(linkId);

            if (!link) {
                return res.status(404).json({
                    error: 'Link not found',
                });
            }
            
            const isDevelopment = process.env.NODE_ENV === 'development';
            const ipAddress = isDevelopment
                ? '8.8.8.8'
                : req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

            const geoResponse = await axios.get(`http://ip-api.com/json/${ipAddress}`);
            const { city, country, region, lat, lon, isp } = geoResponse.data;

            const userAgent = req.headers['user-agent'] || 'Unknown';
            const { deviceType, browser } = getDeviceInfo(userAgent);

            const referrer = req.get('Referrer') || null;

            await Clicks.create({
                linkId: link._id,
                ip: ipAddress,
                city: city,
                country: country,
                region: region,
                latitude: lat,
                longitude: lon,
                isp: isp,
                referrer: referrer,
                userAgent: userAgent,
                deviceType: deviceType,
                browser: browser,
                clickedAt: new Date()
            });
            // Increment the click count
            link.clickCount += 1;
            await link.save();

            // Redirect to the original URL
             res.redirect(link.originalUrl);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: 'Internal server error',
            });
        }
    },
    analytics: async (request, response) => {
        try {
            const { linkId, from, to } = request.query;

            const link = await Links.findById(linkId);
            if (!link) {
                return response.status(404).json({
                    error: 'Link not found'
                });
            }

            const userId = request.user.role === 'admin' 
                ? request.user.id
                : request.user.adminId?.toString();
            if (link.user.toString() !== userId) {
                return response.status(403).json({ error: 'Unauthorized access' });
            }

            const query = {
                linkId: linkId
            };

            if (from && to) {
                query.clickedAt = { $gte: new Date(from), $lte: new Date(to) };
            }

            const data = await Clicks.find(query).sort({ clickedAt: -1 });
            response.json(data);
        } catch (error) {
            console.log(error);
            response.status(500).json({
                message: 'Internal server error'
            });
        }
    },

    createUploadSignature : async (req, res) => {
       
        try {

            const {signature , timestamp } =  generateUploadSignature();
            
            res.json({
                timestamp : timestamp,
                signature : signature,
                apiKey : process.env.CLOUDINARY_API_KEY,
                cloudName : process.env.CLOUDINARY_CLOUD_NAME,
            })

            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: 'Internal server error',
            });
            
        }
    }
};

module.exports = linksController;