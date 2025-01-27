import mongoose from "mongoose"

const db = mongoose.connect("mongodb://localhost:27017/multi-chainWallet")
    .then(() => {
        console.log("connect to mongoDB")
    }).catch(() => {
        "Error to connect mongoDB"
    })

export default db;