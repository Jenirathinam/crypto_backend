
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    blockNumber: { type: String, required: true },
    // timeStamp: { type: String, required: true },
    hash: { type: String, unique: true, required: true },
    nonce: { type: String, required: true },
    blockHash: { type: String, required: true },
    transactionIndex: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    value: { type: String, required: true }, // Store as string to avoid precision issues
    gas: { type: String, required: true },
    gasPrice: { type: String, required: true },
    isError: { type: String, required: true },
    txreceipt_status: { type: String, required: true },
    input: { type: String },
    contractAddress: { type: String, default: "" },
    cumulativeGasUsed: { type: String, required: true },
    gasUsed: { type: String, required: true },
    confirmations: { type: String, required: true },
    methodId: { type: String, default: "" },
    functionName: { type: String, default: "" },
    timeStamp: { type: Date, default: Date.now() }
}, { versionKey: false })


transactionSchema.virtual("transaction_id").get(function () {
    return this._id.toString();
});

const transactionModel = mongoose.model("transaction", transactionSchema);

export default transactionModel





// import mongoose from "mongoose";

// const transactionSchema = new mongoose.Schema({
//     sender: { type: String, required: true },
//     receiver: { type: String, required: true },
//     amount: { type: String, required: true },
//     token: { type: String, required: true },
//     chain: { type: String, required: true },
//     status: { type: String, required: true, enum: ['pending', 'success', 'failed'] },
//     txHash: { type: String, required: true },
//     timeStamp: { type: Date, default: Date.now() }
// }, { versionKey: false })


// transactionSchema.virtual("transaction_id").get(function () {
//     return this._id.toString();
// });

// const transactionModel = mongoose.model("transaction", transactionSchema);

// export default transactionModel