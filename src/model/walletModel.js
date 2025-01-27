
import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    privateKey: { type: String, required: true },
    deviceToken: {
        type: String,
        required: true
    },
    timeStamp: { type: Date, default: Date.now() }
}, { versionKey: false })

walletSchema.virtual("user_id").get(function () {
    return this._id.toString();
});

const walletModel = mongoose.model("createWallet", walletSchema);

export default walletModel