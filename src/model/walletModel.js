
import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
    // email: { type: String, required: true },
    // password: { type: String, required: true },
    mnemonic:{type: String, required: true} ,
    address:{type: String, required: true}, 
    aliasName:{type: String, required: true},
    isImported:{type: Boolean, required: true},
    balance:{type: Number, required: true},
    publicKey:{type: String, required: true},
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