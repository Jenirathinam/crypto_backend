// import mongoose from "../db/db.js";

import mongoose from "mongoose";
const pushNotification = new mongoose.Schema(
    {
        message: { type: String },
        status: {
            type: String,
            enum: [
                "Canceled",
                "Completed"
            ],
        },
        timestamp: { type: Date, default: Date.now },
    },
    { versionKey: false }
);

pushNotification.virtual("notification_id").get(function () {
    return this._id.toString();
});

const notificationModel = mongoose.model("pushnotification", pushNotification);

export default notificationModel;
