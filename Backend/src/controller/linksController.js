const Links = require('../model/Links');

const linksController = {

    create : async (req, res) => {

        // console.log(req.body);

        const {campaignTitle, originalUrl, category} = req.body;

        try {

            //  console.log(req.user.id);
            
            const link = new Links({
                campaignTitle: campaignTitle, 
                originalUrl: originalUrl,
                category: category,
                user: req.user.id
            });


            await link.save();
            res.status(200).json({
                data : {id : link._id , message : 'Link created successfully'},
            });
            
        } catch (error) {
            console.log(error) ;
            return res.status(500).json({
                error : 'Internal server error'
            });
        }
    } , 

    getAll : async (req, res) => {
        try {
            const links = await Links.find({ user: req.user.id }).sort({createdAt: -1});

            return res.status(200).json({
                data: links,
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

            if (link.user.toString() !== req.user.id) {
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
            let link = await Links.findById(linkId);
            
            if (!link) {
                return res.status(404).json({
                    error: 'Link does not exist with the given id',
                });
            }

            if (link.user.toString() !== req.user.id) {
                return res.status(403).json({
                    error: 'Unauthorized access',
                });
            }

            const { campaignTitle, originalUrl, category } = req.body;
            link = await Links.findByIdAndUpdate(linkId, {
                campaignTitle: campaignTitle,
                originalUrl: originalUrl, 
                category: category , 
                
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
            let link = await Links.findById(linkId);

            if (!link) {
                return res.status(404).json({
                    error: 'Link does not exist with the given id',
                });
            }

            if (link.user.toString() !== req.user.id) {
                return res.status(403).json({
                    error: 'Unauthorized access',
                });
            }

            await link.deleteOne();

            res.json({ message: 'Link deleted successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: 'Internal server error',
            });
        }
    }, 
    redirect : async (req, res) => {
        const linkId = req.params.id;

        if (!linkId) {
            return res.status(401).json({
                error: 'Link ID is required',
            });
        }

        try {
            let link = await Links.findById(linkId);

            if (!link) {
                return res.status(404).json({
                    error: 'Link not found',
                });
            }

            // Increment the click count
            link.clickCount += 1;
            await link.save();

            // Redirect to the original URL
            return res.redirect(link.originalUrl);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: 'Internal server error',
            });
        }
    }
};

module.exports = linksController;