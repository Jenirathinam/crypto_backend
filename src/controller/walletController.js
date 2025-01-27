
import walletService from "../service/walletService.js"

const walletController = {

    // createWallet: async (req, res) => {

    //     const { email, password, privateKey } = req.body
    //     console.log(req.body)
    //     try {
    //         if (!email || !password || !privateKey) {
    //             throw new Error("email,password,privateKey required")
    //         }

    //         const createWallet = await walletService.createWallet(req.body)
    //         res.status(200).json({ msg: "stored successfully", token: createWallet })
    //     } catch (error) {
    //         res.status(500).json({ msg: "Failed to create wallet", error: error.message })
    //     }


    // },

    createWallet: async (req, res) => {

        const { mnemonic,address,aliasName,isImported,balance,deviceToken,publicKey, privateKey } = req.body
        console.log(req.body)
        try {
          
            const createWallet = await walletService.createWallet(req.body)
            res.status(200).json({ msg: "stored successfully", token: createWallet })
        } catch (error) {
            res.status(500).json({ msg: "Failed to create wallet", error: error.message })
        }


    },
    // ======================
    getWalletHistory: async (req, res) => {
        const { chain, order, address } = req.body
        console.log(req.body, "boys")
        try {
            const getWalletHistory = await walletService.getWalletHistory(req.body);
            res.status(200).json({ msg: "History fetched successfully", getWalletHistory })

        }
        catch (error) {
            res.status(500).json({ msg: "Failed to get wallet history", error: error.message })
        }
    },
    // =================
    getNativeTransaction: async (req, res) => {
        const { chain, order, address } = req.body
        console.log(req.body, "boys")
        try {
            const getNativeTransaction = await walletService.getNativeTransaction(req.body);
            res.status(200).json({ msg: "NativeTransaction fetched successfully", getNativeTransaction })

        } catch (error) {
            res.status(500).json({ msg: "Failed to get NativeTransaction", error: error.message })

        }
    },
    // ===================
    getNativeBalanceByWallet: async (req, res) => {
        const { address } = req.body;
        try {
            if (!address) {
                throw new Error("Address is required");
            }
            const addresss = String(address);
            const getNativeBalanceByWallet = await walletService.getNativeBalanceByWallet(addresss);
            console.log(getNativeBalanceByWallet, "llo")
            res.status(200).json({ msg: "NativeBalanceByWallet fetched successfully", getNativeBalanceByWallet })

        } catch (error) {
            res.status(500).json({ msg: "Failed to get NativeBalanceByWallet", error: error.message })

        }
    },

    //====================
    getNativeBalanceByMultiWallet: async (req, res) => {
        const { chain, walletAddresses } = req.body;
        console.log(req.body)

        if (!chain || !walletAddresses || !Array.isArray(walletAddresses)) {
         
            throw new Error("chain,addresses is required");
        }
        try {
            const getNativeBalanceByMultiWallet = await walletService.getNativeBalanceByMultiWallet({chain, walletAddresses });
            res.status(200).json({
                msg: "NativeBalanceByMultiWallet fetched successfully",
                getNativeBalanceByMultiWallet
            });
    
        } catch (error) {
            // Handle errors
            res.status(500).json({
                msg: "Failed to get NativeBalanceByMultiWallet",
                error: error.message
            });
        }
    }
    ,

    // ======================
    getChainActivity:async (req, res) => {
        const { address } = req.body;
        console.log(address)
        try {
            if (!address) {
                throw new Error("address is required");
            }
            
            const getChainActivity = await walletService.getChainActivity(address);
           
            res.status(200).json({ msg: "getChainActivity fetched successfully", getChainActivity })

        } catch (error) {
            res.status(500).json({ msg: "Failed to get getChainActivity", error: error.message })

        }
    },
    // =======================
    getMultipleERC2Token:  async (req, res) => {
        const { chain,tokens } = req.body;
        
        try {
            if (!chain ||!tokens) {
                throw new Error("chain,tokens is required");
            }
            
            if (tokens.length < 1) {
                return res.status(400).json({ msg: "Tokens array must contain at least one token" });
              }
          
              if (tokens.length > 100) {
                return res.status(400).json({ msg: "You can only request up to 100 tokens at a time" });
              }
            const getMultipleERC2Token = await walletService.getMultipleERC2Token(req.body);
           
            res.status(200).json({ msg: "getMultipleERC2Token fetched successfully", getMultipleERC2Token })

        } catch (error) {
            res.status(500).json({ msg: "Failed to get getMultipleERC2Token", error: error.message })

        }
    },

    // =======================
     getTransactions:async (req, res) => {
        const { address } = req.params;
      
        try {
          const transactions = await walletService.fetchTransactions(address);
          res.status(200).json({ msg: "success",transactions })
        } catch (error) {
          res.status(500).send('Error fetching transactions');
        }
      },
// ==============================
      getBalance:async (req, res) => {
        const { address } = req.params;
      
        try {
          const getBalance = await walletService.getBalance(address);
          res.status(200).json({ msg: "success",getBalance })
        } catch (error) {
          res.status(500).send('Error fetching getBalance');
        }
      },
    // =================
   

    //   =====================test
   
    

    sendTransaction:async (req, res) => {
        const { privateKey, toAddress, amountInEther } = req.body;
      
        try {
          const sendTransaction = await walletService.sendTransaction(req.body);
          res.status(500).json({ msg: "success",sendTransaction })
        } catch (error) {
          res.status(500).send('Error fetching sendTransaction');
        }
      },
   
   
  

}


export default walletController