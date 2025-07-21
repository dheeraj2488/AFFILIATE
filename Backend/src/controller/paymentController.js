const Razorpay = require('razorpay');
const {CREDIT_PACKS, PLAN_IDS } = require('../constants/payments'); 
const crypto = require('crypto');
const Users = require('../model/Users');
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const paymentController = {

    createOrder : async (req, res) => {
        try {
            
            const {credits} = req.body;
            console.log("credits", credits);
            // Make sure user provided creadits is one of the allowed value
           
            
            if(!CREDIT_PACKS[credits]){
                return res.status(400).json({message: "Invalid credit pack"});
            }

            const amount = CREDIT_PACKS[credits] * 100; // Convert to paise

            const order = await razorpay.orders.create({
                amount: amount,
                currency: "INR",
                receipt: `receipt_${Date.now()}`,
            });

            res.json({order : order});
        } catch (error) {
            console.error("Error creating order:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    } , 
    verifyOrder : async (req, res) => {

        try {
            // console.log("idhr tk chl rha hai " , req.body);
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature , credits } = req.body;


            const body = razorpay_order_id + "|" + razorpay_payment_id;
            
            const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString()).digest('hex'); // 1> here we are generating the expected signature or we are hashing the orderid and payment id with
            // the help of crypto module 
            // so here we are hashing  the order id and payment id with the help of
            //sha256 algorithm and then we are converting it to hex format

            if( razorpay_signature !== expectedSignature) {
                return res.status(400).json({ message: " signature verification failed" });
            } //  2> this is the verification of the signature that we are getting from the razorpay , if this is not same then 
            // it means someone has tampered with the data or the payment is not valid

            //3 > now when the verification is done we can update the user credits in the database
            const user = await Users.findById({ _id : req.user._id});
        
            user.credits += Number(credits); // here we are adding the credits to the user credits
            
            await user.save(); // here we are saving the user data to the database


            res.json({ user: user });
        } catch (error) {
            console.error("Error verifying order:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    } ,
    createSubscription: async (request, response) => {
        try {
            const { plan_name } = request.body;
            if (!PLAN_IDS[plan_name]) {
                return response.status(400).json({
                    message: 'Invalid plan id'
                });
            }

            const plan = PLAN_IDS[plan_name];
            const subscription = await razorpay.subscriptions.create({
                plan_id: plan.id,
                customer_notify: 1,
                total_count: plan.totalBillingCycleCount,
                // Customer notes field, razorpay sends it as is in the events.
                // We can use this field to set user id so that we know the event
                // belongs to which user in our database.
                notes: {
                    email: request.user.username,
                    userId: request.user.id
                }
            });
            response.json({ subscription: subscription });
        } catch (error) {
            console.log(error);
            response.status(500).json({
                message: 'Internal server error'
            });
        }
    },
    verifySubscription: async (request, response) => {
        try {
            const { subscription_id } = request.body;
            const subscription = await razorpay.subscriptions.fetch(subscription_id);
            const user = await Users.findById(request.user.id);
           
            user.subscription = {
                id: subscription_id,
                planId: subscription.plan_id,
                status: subscription.status,
                start: subscription.current_start
                    ? new Date(subscription.current_start * 1000)
                    : null,
                end: subscription.current_end
                    ? new Date(subscription.current_end * 1000)
                    : null,
            };
            await user.save();
            response.json({ user: user });
        } catch (error) {
            console.log(error);
            response.status(500).json({
                message: 'Internal server error'
            });
        }
    },
    handleWebhookEvent: async (request, response) => {
        try {
            console.log('Received event...');
            const signature = request.headers['x-razorpay-signature'];
            const body = request.body;

            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
                .update(body)
                .digest('hex');

            if (signature !== expectedSignature) {
                return response.status(400).send('Invalid signature');
            }

            const payload = JSON.parse(body);
            console.log(JSON.stringify(payload, 0, 2));
            const event = payload.event;
            const subscriptionData = payload.payload.subscription.entity;

            const razorpaySubscriptionId = subscriptionData.id;
            let userId = subscriptionData.notes?.userId;
            if (!userId) {
                console.log('UserId not found via notes');
                return response.status(400).send('UserId not found via notes');
            }

            let newStatus = '';
            switch (event) {
                case 'subscription.activated':
                    newStatus = 'active';
                    break;
                case 'subscription.pending':
                    newStatus = 'pending';
                    break;
                case 'subscription.cancelled':
                    newStatus = 'cancelled';
                    break;
                case 'subscription.completed':
                    newStatus = 'completed';
                    break;
                default:
                    console.log('Unhandled event: ', event);
                    return response.status(200).send('Unhandled event');
            }

            const user = await Users.findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        'subscription.id': razorpaySubscriptionId,
                        'subscription.status': newStatus,
                        'subscription.start': subscriptionData.start_at
                            ? new Date(subscriptionData.start_at * 1000)
                            : null,
                        'subscription.end': subscriptionData.end_at
                            ? new Date(subscriptionData.end_at * 1000)
                            : null,
                        'subscription.lastBillDate': subscriptionData.current_start
                            ? new Date(subscriptionData.current_start * 1000)
                            : null,
                        'subscription.nextBillDate': subscriptionData.current_end
                            ? new Date(subscriptionData.current_end * 1000)
                            : null,
                        'subscription.paymentsMade': subscriptionData.paid_count,
                        'subscription.paymentsRemaining': subscriptionData.remaining_count,
                    }
                },
                { new: true }
            );

            if (!user) {
                return response.status(400).send('UserId does not exist');
            }

            console.log(`Updated subscription for user ${userId} to ${newStatus}`);
            return response.status(200).send('Event processed');
        } catch (error) {
            console.log(error);
            response.status(500).json({
                message: 'Internal server error'
            });
        }
    },
    cancelSubscription: async (request, response) => {
        try {
            const { subscription_id } = request.body;

            if (!subscription_id) {
                return response.status(400).json({
                    message: 'SubscriptionID is required to cancel'
                });
            }

            const data = await razorpay.subscriptions.cancel(subscription_id);

            response.json(data);
        } catch (error) {
            console.log(error);
            response.status(500).json({
                message: 'Internal server error'
            });
        }
    },

}

module.exports = paymentController;