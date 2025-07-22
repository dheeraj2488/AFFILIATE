import { useSelector } from "react-redux";
import PurchaseCredit from "./PurchaseCredit";
import Subscription from "./Subscription";
import PendingConfirmation from "./PendingConfirmation";
import NoSubscription from "./NoSubscription";
import AdminSubscription from "./AdminSubscription";
function ManagePayments() {
  const userDetails = useSelector((state) => state.userDetails);
  
  const confirmationStatus = ["created", "pending", "authenticated"];

  if(userDetails.role === "viewer"){

    const adminSubscription = userDetails.adminSubscription;
    console.log("Admin Subscription:", adminSubscription);
    
    if(!adminSubscription || !adminSubscription.status ) {

      return <NoSubscription/>

    }else{

      if (adminSubscription.status === "active") {
        return <AdminSubscription />;
      }else{
        return <NoSubscription />;
      } 
    }
  }

  if (userDetails.subscription?.status === "active") {
    return <Subscription />;
  } else if (confirmationStatus.includes(userDetails.subscription?.status)) {
    return <PendingConfirmation />;
  } else {
    return <PurchaseCredit />;
  }
}

export default ManagePayments;
