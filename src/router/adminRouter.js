
import express from "express"
import adminController from "../controller/admincontroller.js"
const router=express.Router();

router.get("/monitortransactions",adminController.monitorTransactions);


router.post("/pushNotification", adminController.pushNotification);
export default router