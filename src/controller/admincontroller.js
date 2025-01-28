import adminService from "../service/adminService.js"

const adminController = {

    
monitorTransactions:async(req,res)=>{
  console.log("ppp")
    try{
        const monitorTransactions = await adminService.monitorTransactions();
        res.status(200).json({ msg: "fetched successfully",  monitorTransactions })
    } catch (error) {
        res.status(500).json({ msg: "Failed to fetch transaction", error: error.message })
    }
},
// ===================
pushNotification: async (req, res) => { 
    try {
      const { address, status } = req.body;
      const dd = await adminService.pushNotification(address, status);
      res
        .status(200)
        .json({ success: true, message: "Notification sent successfully" });
    } catch (error) {
     console.log(error,"uytre")
      res
        .status(200)
        .json({ success: false, message:  error });
  }
}
//   ================



}


export default adminController