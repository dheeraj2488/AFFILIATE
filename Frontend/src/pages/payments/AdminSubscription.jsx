import React from 'react';
import { useSelector } from 'react-redux';
import {toast} from 'react-hot-toast';
const formatDate = (isoDateString) => {
  if (!isoDateString) return 'N/A';
  try {
    const date = new Date(isoDateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.error("Date format error:", error);
    return 'Invalid date';
  }
};

const AdminSubscription = () => {
  const userDetails = useSelector((state) => state.userDetails);
  const subscription = userDetails?.adminSubscription;

  const handleCancel = () => {
    toast.error("Only admin can cancel the subscription.");
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-center mb-3">Admin's Subscription Summary</h3>
              <hr />

              <div className="pb-2">
                <strong>Start Date: </strong> {formatDate(subscription.start)}
              </div>
              <div className="pb-2">
                <strong>End Date: </strong> {formatDate(subscription.end)}
              </div>
              <div className="pb-2">
                <strong>Last Payment Date: </strong> {formatDate(subscription.lastBillDate)}
              </div>
              <div className="pb-2">
                <strong>Next Payment Date: </strong> {formatDate(subscription.nextBillDate)}
              </div>
              <div className="pb-2">
                <strong>Total Payments Made: </strong> {subscription.paymentsMade}
              </div>
              <div className="pb-2">
                <strong>Payments Remaining: </strong> {subscription.paymentsRemaining}
              </div>

              <hr />
              <div className="text-center">
                <button className="btn btn-danger w-50" onClick={handleCancel} disabled>
                  Cancel
                </button>
                <p className="text-muted mt-2" style={{ fontSize: "0.9rem" }}>
                  Only admins can manage subscriptions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSubscription;
