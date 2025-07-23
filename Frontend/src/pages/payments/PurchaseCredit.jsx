import { useDispatch, useSelector } from "react-redux";
import { CREDIT_PACKS, PLAN_IDS, pricingList } from "../../config/payments";
import { useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../../config";
import "./PurchaseCredit.css";
import { Modal } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function PurchaseCredit() {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showCredits, setshowCredits] = useState(false);



  const subscriptionStatus = userDetails.subscription?.status;
  console.log("Subscription Status:", subscriptionStatus);

  const handleBuyCredits = async (credits) => {
    setShowModal(false);
    try {
      const { data } = await axios.post(
        `${serverEndpoint}/payments/create-order`,
        { credits },
        { withCredentials: true }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Affiliate++",
        description: `${credits} Credits Pack`,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            const { data } = await axios.post(
              `${serverEndpoint}/payments/verify-order`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                credits,
              },
              { withCredentials: true }
            );

            dispatch({ type: "SET_USER", payload: data.user });
            toast.success(`${credits} credits added!`);
          } catch (error) {
            console.error(error);
            setErrors({
              message: "Unable to purchase credits, please try again",
            });
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      setErrors({ message: "Unable to purchase credits, please try again" });
    }
  };

  const handleSubscribe = async (planKey) => {
    try {
      const { data } = await axios.post(
        `${serverEndpoint}/payments/create-subscription`,
        { plan_name: planKey },
        { withCredentials: true }
      );

      const plan = PLAN_IDS[planKey];
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        name: plan.planName,
        description: plan.description,
        subscription_id: data.subscription.id,
        handler: async (response) => {
          try {
            const user = await axios.post(
              `${serverEndpoint}/payments/verify-subscription`,
              { subscription_id: response.razorpay_subscription_id },
              { withCredentials: true }
            );

            dispatch({ type: "SET_USER", payload: user.data.user });
            toast.success("Subscription activated");
          } catch (error) {
            setErrors({
              message: "Unable to activate subscription, please try again",
            });
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      setErrors({ message: "Failed to create subscription" });
    }
  };

  return (
    <section className="ezy__pricing10 light py-5" id="ezy__pricing10">
      <div className="container">
        {errors.message && (
          <div className="alert alert-danger">{errors.message}</div>
        )}

        <div className="text-left d-flex justify-content-between align-items-start w-100">
          <div>
            <h3 className="ezy__pricing10-heading">Choose Plan</h3>
            <p className="ezy__pricing10-sub-heading mt-3">
              Flexible options: one-time credits or recurring subscriptions.
            </p>
          </div>

          <div className="text-right">
            <h3 className="text-lg font-semibold">Current Balance</h3>

            <div className="d-flex items-center mt-3 gap-3">
              <p className="ezy__pricing10-sub-heading text-lg font-bold">
                {showCredits ? `₹ ${userDetails.credits}` : "******"}
              </p>
              <span
                onClick={() => setshowCredits((prev) => !prev)}
                style={{ cursor: "pointer" }}
              >
               {showCredits ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </span>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Credit Pack Card */}
          <div className="col-md-6 col-xl-4 mt-4 text-center ">
            <div className="card ezy__pricing10-card p-4 border-0 rounded-0">
              <div className="card-body pt-4">
                <p className="ezy__pricing10-meta-price">
                  <span className="ezy__pricing10-rate">Credit Packs</span>
                </p>
              </div>
              <div className="card-body pb-4 p-0">
                <ul className="nav ezy__pricing10-nav flex-column">
                  {CREDIT_PACKS.map((c) => (
                    <li className="pb-2" key={c}>
                      {c} CREDITS FOR ₹{c}
                    </li>
                  ))}
                </ul>
                <button
                  className="btn btn-outline-light mt-3"
                  style={{ backgroundColor: "#0dcaf0" }}
                  onClick={() => setShowModal(true)}
                >
                  Buy Credits
                </button>
              </div>
            </div>
          </div>

          {/* Monthly Plan */}
          <div className="col-md-6 col-xl-4 mt-4 text-center">
            <div className="card ezy__pricing10-card p-4 border-0 rounded-0">
              <div className="card-body pt-4">
                <p className="ezy__pricing10-meta-price">
                  <span className="ezy__pricing10-rate">₹199/month</span>
                </p>
              </div>
              <div className="card-body pb-4 p-0">
                <ul className="nav ezy__pricing10-nav flex-column">
                  {pricingList[1].list.map((item, i) => (
                    <li className="pb-2" key={i}>
                      {item.detail}
                    </li>
                  ))}
                </ul>
                <button
                  className="btn btn-outline-light mt-3"
                  style={{ backgroundColor: "#0dcaf0" }}
                  onClick={() => handleSubscribe("UNLIMITED_MONTHLY")}
                >
                  Subscribe Monthly
                </button>
              </div>
            </div>
          </div>

          {/* Yearly Plan */}
          <div className="col-md-6 col-xl-4 mt-4 text-center">
            <div className="card ezy__pricing10-card p-4 border-0 rounded-0">
              <div className="card-body pt-4">
                <p className="ezy__pricing10-meta-price">
                  <span className="ezy__pricing10-rate">₹1990/year</span>
                </p>
              </div>
              <div className="card-body pb-4 p-0">
                <ul className="nav ezy__pricing10-nav flex-column">
                  {pricingList[2].list.map((item, i) => (
                    <li className="pb-2" key={i}>
                      {item.detail}
                    </li>
                  ))}
                </ul>
                <button
                  className="btn btn-outline-light mt-3"
                  onClick={() => handleSubscribe("UNLIMITED_YEARLY")}
                  style={{ backgroundColor: "#0dcaf0" }}
                >
                  Subscribe Yearly
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* React-Bootstrap Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Buy Credits</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            {CREDIT_PACKS.map((c) => (
              <button
                key={c}
                className="m-2 btn btn-info"
                onClick={() => handleBuyCredits(c)}
              >
                Buy {c} Credits
              </button>
            ))}
          </Modal.Body>
        </Modal>
      </div>
    </section>
  );
}

export default PurchaseCredit;
