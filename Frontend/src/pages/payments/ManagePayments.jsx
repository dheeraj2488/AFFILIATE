import { useSelector } from "react-redux";
import PurchaseCredit from "./PurchaseCredit";
import Subscription from "./Subscription";
import PendingConfirmation from "./PendingConfirmation";
function ManagePayments() {
  const userDetails = useSelector((state) => state.userDetails);
  
  const confirmationStatus = ["created", "pending", "authenticated"];
  if (userDetails.subscription?.status === "active") {
    return <Subscription />;
  } else if (confirmationStatus.includes(userDetails.subscription?.status)) {
    return <PendingConfirmation />;
  } else {
    return <PurchaseCredit />;
  }
}

export default ManagePayments;
