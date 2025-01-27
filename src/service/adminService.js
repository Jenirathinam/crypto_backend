import notificationModel from "../model/notification.js";
import transactionModel from "../model/TransactionModel.js";
import walletModel from "../model/walletModel.js";
import { Expo } from "expo-server-sdk";
const expo = new Expo();
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
    pushNotification: async (address, status) => {
        try {
          console.log("u", address, status);
          const recipient = await walletModel.findOne({address});
          console.log("ed", recipient);
          if (!recipient) {
            throw new Error("Recipient not found");
          }
    
          let deviceToken;
          deviceToken= recipient.deviceToken;
    
          if (!deviceToken) {
            throw new Error("Device token not found for the recipient");
          }
    
          const messageInfo = await notificationModel.findOne({ status });
          if (!messageInfo) {
            throw new Error(`Message not found for status: ${status}`);
          }
          const message = messageInfo.message;
    
          const tickets = await adminService.sendNotificationToDevice(
            deviceToken,
            message
          );
          // console.log("Tickets:", tickets);
          return tickets;
        } catch (error) {
          console.error("Error sending notification:", error);
          throw error;
        }
      },
    
      // ===========================================
      sendNotificationToDevice: async (deviceToken, message) => {
        console.log("Device token:", deviceToken, message);
        try {
          const pushMessage = {
            to: deviceToken,
            sound: "default",
            body: message,
          };
    
          console.log("Push message:", pushMessage);
    
          const tickets = await expo.sendPushNotificationsAsync([pushMessage]);
          console.log("Tickets:", tickets);
    
          for (const ticket of tickets) {
            if (ticket.status === "ok") {
              console.log(`Notification sent successfully to ${ticket.id}`);
            } else {
              console.error(`Error sending notification: ${ticket.message}`);
              if (ticket.details && ticket.details.error) {
                console.error(`Error details: ${ticket.details.error}`);
              }
            }
          }
          console.log("tickets", tickets);
          return tickets;
        } catch (error) {
          console.error("Error sending notification:", error);
          throw error;
        }
      },
    
}



export default adminService