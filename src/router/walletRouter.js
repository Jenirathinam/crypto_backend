
import express from "express"
import walletController from "../controller/walletController.js"
const router=express.Router();

router.post("/createWallet",walletController.createWallet);



// router.get("/getWalletHistory",walletController.getWalletHistory);
// router.get("/getNativeTransaction",walletController.getNativeTransaction);
// router.get("/getNativeBalanceByWallet",walletController.getNativeBalanceByWallet);
// router.get("/getNativeBalanceByMultiWallet",walletController.getNativeBalanceByMultiWallet);

// router.get("/getChainActivity",walletController.getChainActivity);
// router.get("/getMultipleERC2Token",walletController.getMultipleERC2Token)



router.get('/getTransactions/:address', walletController.getTransactions);

router.get('/getBalance/:address', walletController.getBalance);

router.post('/transaction', walletController.sendTransaction);

export default router