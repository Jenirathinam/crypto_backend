import notificationModel from "../model/notification.js";
import transactionModel from "../model/TransactionModel.js";
import walletModel from "../model/walletModel.js";

import admin from 'firebase-admin';
import serviceAccount from "../../src/firebases.json"assert { type: 'json' }

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const adminService= {
    monitorTransactions: async () => {
        console.log("Starting monitorTransactions");
        try {
            console.log("Fetching transactions...");
            const monitorTransactions = await transactionModel.find();
            console.log(monitorTransactions, "monitorTransactions");
            return monitorTransactions;
        } catch (error) {
            console.error("Error in monitorTransactions:", error);
            throw new Error(error.message);
        }
    },
    // ===================
    pushNotification:async (token, msg) => {
      const message = {
          notification: {
              title:"Crypto Notification",
              body:msg,
          },
          token,
      };
  console.log(message,"kkkkkk")
      try {
          const response = await admin.messaging().send(message);
          console.log('Notification sent successfully:', response);
      } catch (error) {
          if (error.code === 'messaging/registration-token-not-registered') {
              console.error('Token not registered, removing from database...');
              // Remove the invalid token from your database
              // Example: await UserModel.updateOne({ fcmToken: token }, { $unset: { fcmToken: 1 } });
          } else {
              console.error('Error sending notification:', error);
          }
      }
  }
    
}



export default adminService