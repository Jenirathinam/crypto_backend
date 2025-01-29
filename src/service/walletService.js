import { error } from "console"
import walletModel from "../model/walletModel.js"
import crypto from "crypto"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const SECRET_KEY = crypto.randomBytes(32).toString('hex');
import axios from "axios"
import Moralis from 'moralis';
import { SolNetwork } from "@moralisweb3/common-sol-utils";

import { ethers, Wallet, parseEther, parseUnits } from "ethers";
import walletController from "../controller/walletController.js"
import transactionModel from "../model/TransactionModel.js"
import adminController from "../controller/admincontroller.js"
import notificationModel from "../model/notification.js"
import adminService from "./adminService.js"



const apiKey = await Moralis.start({
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjNmMzhlOTAyLTdlNGYtNGU5Zi05NTBiLTU4ZjU3N2JjYzQ4NSIsIm9yZ0lkIjoiMzk4MDMxIiwidXNlcklkIjoiNDA4OTkyIiwidHlwZUlkIjoiMzEyZGY1Y2UtY2QzMC00Yzc0LWFiNjQtMDY3NzRkZDYwYTkwIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MTk0OTAxOTYsImV4cCI6NDg3NTI1MDE5Nn0.KTIJqXydFFysWU5fI1lzJ2lWMbj8E5CNiUotW-HZAfk",
});
const INFURA_URL = `https://sepolia.infura.io/v3/67048bd8b88444cbb4d0aee7adcbffd1`;

const provider = new ethers.JsonRpcProvider(INFURA_URL);

const isValidPrivateKey = (key) => /^0x[a-fA-F0-9]{64}$/.test(key);
const walletService = {

    createWallet: async (data) => {
        const { mnemonic, address, aliasName, deviceToken, isImported, balance, publicKey, privateKey } = data;

        try {
            const checkAddress = await walletModel.findOne({ address });
            console.log("Checking wallet address existence:", checkAddress);

            let wallet;

            if (isImported == false) {

                const encryptPrivateKey = await bcrypt.hash(privateKey, 10);
                wallet = await walletModel.create({
                    mnemonic,
                    address,
                    aliasName,
                    isImported,
                    deviceToken,
                    balance,
                    publicKey,
                    privateKey: encryptPrivateKey,
                });

                console.log("Wallet created successfully:", wallet);
            } else {
                console.log("Handling imported wallet...");

                if (checkAddress) {
                    wallet = await walletModel.findOneAndUpdate(
                        { address },
                        { deviceToken, balance },
                        { new: true }
                    );

                    console.log("Wallet updated successfully:", wallet);
                } else {
                    const encryptPrivateKey = await bcrypt.hash(privateKey, 10);

                    wallet = await walletModel.create({
                        mnemonic,
                        address,
                        aliasName,
                        isImported,
                        deviceToken,
                        balance,
                        publicKey,
                        privateKey: encryptPrivateKey,
                    });

                    console.log("Imported wallet created successfully:", wallet);
                }
            }

            const token = jwt.sign(
                { user_id: wallet._id },
                SECRET_KEY
            );

            console.log("Generated token:", token);
            return token;
        } catch (error) {
            console.error("Error in createWallet:", error.message);
            throw error;
        }
    },



    getWalletHistory: async (data) => {
        const { chain, order, address } = data
        console.log(data, "data")

        try {
            const getWalletHistory = await Moralis.EvmApi.wallets.getWalletHistory({
                chain: chain,
                order: order,
                address: address,
            });
            console.log(getWalletHistory, "res")
            return response;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // =======================
    getNativeTransaction: async (data) => {
        const { chain, order, address } = data
        console.log(data, "data")

        try {
            const getNativeTransaction = await Moralis.EvmApi.transaction.getWalletTransactions({
                chain: chain,
                order: order,
                address: address,
            });
            console.log(getNativeTransaction, "res")
            return getNativeTransaction;
        } catch (error) {
            throw new Error(error.message);
        }
    },
    // =========================
    getNativeBalanceByWallet: async (address) => {
        console.log(address, "add")
        try {
            const addresss = String(address);
            console.log(addresss, "ggg (converted to string)");

            const network = SolNetwork.MAINNET;
            console.log(network, "net")
            const getNativeBalanceByWallet = await Moralis.SolApi.account.getBalance({
                address: addresss,
                network,
            });

            console.log(getNativeBalanceByWallet);
            return getNativeBalanceByWallet
        } catch (error) {

            throw new Error(error.message);

        }
    },

    // =====================
    getNativeBalanceByMultiWallet: async (data) => {
        const { chain, walletAddresses } = data
        console.log(data, "chain")

        try {
            const getNativeBalanceByMultiWallet = await Moralis.EvmApi.balance.getNativeBalancesForAddresses({
                chain,
                walletAddresses,
            });
            console.log(getNativeBalanceByMultiWallet, "getNativeBalanceByMultiWallet")
            return getNativeBalanceByMultiWallet;
        } catch (error) {
            console.log(error)
            throw new Error(error.message);
        }
    },
    // ====================
    getChainActivity: async (address) => {
        console.log(address, "data")

        try {
            const getChainActivity = await Moralis.EvmApi.wallets.getWalletActiveChains({

                address: address,
            });
            console.log(getChainActivity, "res")
            return getChainActivity;
        } catch (error) {
            throw new Error(error.message);
        }
    },
    // ==================
    getMultipleERC2Token: async (data) => {
        const { chain, tokens } = data;
        console.log(data, "data");

        try {
            if (!Array.isArray(tokens) || tokens.length === 0) {
                throw new Error("The tokens array must be provided and should not be empty.");
            }

            if (tokens.length > 100) {
                throw new Error("You can only request up to 100 tokens at a time.");
            }

            const response = await Moralis.EvmApi.token.getMultipleTokenPrices({
                chain: chain,
                include: "percent_change"
            }, {
                tokens: tokens
            });

            console.log(response.raw, "response");
            return response.raw;
        } catch (error) {
            console.error(error, "error");
            throw new Error(error.message);
        }
    },


    fetchTransactions: async (address, startblock = 0, endblock = 99999999, page = 1, offset = 10000) => {
        const apiKey = '7VF9J4C4QBYKZPRV19G4374M3YPKJ2NAJT';
        const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${startblock}&endblock=${endblock}&page=${page}&offset=${offset}&sort=desc&apikey=${apiKey}`;

        try {
            const response = await axios.get(url);
            //   console.log(response.data,"uuu")
            return response.data;
        } catch (error) {
            console.error('Error fetching transactions:', error);
            throw new Error('Unable to fetch transactions');
        }
    },
    //   ==========================
    getBalance: async (address) => {
        const apiKey = '7VF9J4C4QBYKZPRV19G4374M3YPKJ2NAJT';
        const url = `https://api.etherscan.io/v2/api?chainid=11155111&module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`;

        try {
            const response = await axios.get(url);
            console.log(response.data, "uuu")
            return response.data;
        } catch (error) {
            console.error('Error fetching transactions:', error);
            throw new Error('Unable to fetch transactions');
        }
    },

    //   

    //test
    // sendTransaction:async (data) => {
    //     const {privateKey, toAddress, amountInEther}=data
    //     try {
    //       console.log( data);
    //       const privatekeys=`0x${privateKey}`
    //       if (!isValidPrivateKey(privatekeys)) {
    //         throw new Error("Invalid private key format. Ensure it is a valid 64-character hexadecimal string prefixed with '0x'.");
    //       }
    //       // Initialize wallet and provider
    //       const wallet = new Wallet(privatekeys, provider);

    //       // Check wallet balance
    //       const balance = await provider.getBalance(wallet.address);
    //       console.log("Wallet balance:", ethers.formatEther(balance), "ETH");

    //       if (balance < ethers.parseEther(amountInEther)) {
    //         throw new Error("Insufficient funds.");
    //       }

    //       // Transaction parameters
    //       const tx = {
    //         to: toAddress,
    //         value: parseEther(amountInEther), // Amount to send
    //         gasLimit: 21000, // Gas limit for basic ETH transfer
    //         maxFeePerGas: parseUnits("30", "gwei"), // Adjust gas price
    //         maxPriorityFeePerGas: parseUnits("2", "gwei"),
    //         chainId: 11155111, // Sepolia testnet chain ID
    //       };

    //       // Sign and send the transaction
    //       const txResponse = await wallet.sendTransaction(tx);
    //       console.log("Transaction sent! Hash:", txResponse.hash);

    //       // Wait for confirmation
    //       const receipt = await txResponse.wait();
    //       console.log("Transaction confirmed! Receipt:", receipt);

    //       return receipt;
    //     } catch (error) {
    //       console.error("Error sending transaction:", error.message);
    //       throw error;
    //     }
    //   }

    // ==============

    sendTransaction: async (data) => {

        console.log(data,"fffff")
        const { privateKey, toAddress, amountInEther } = data;
        const maxRetries = 10;
        const retryInterval = 5000;
        // console.log(privateKey, toAddress, amountInEther)
        // console.log(privateKey, "poi1")
        try {
            if (typeof data === "string") {
                try {
                    data = JSON.parse(data);  
                    console.log("Parsed data:", data);
                } catch (error) {
                    console.error("Invalid JSON format. Unable to parse.");
                    return;
                }
            }
            console.log(data.privateKey, "poi2")
            
            const privateKey=data.privateKey;
            if (!privateKey) {
                throw new Error("Private key is missing or undefined.");
            }
            // console.log(amountInEther, "poi")
            const formattedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;

            if (!ethers.isHexString(formattedPrivateKey, 32)) {
                throw new Error('Invalid private key format. Ensure it is a valid 64-character hexadecimal string prefixed with "0x".');
            }

            const wallet = new ethers.Wallet(formattedPrivateKey, provider);

            const nonce = await provider.getTransactionCount(wallet.address);

            const tx = {
                to: data.toAddress,
                value: parseEther(data.amountInEther), 
                gasLimit: 21000, 
                maxFeePerGas: parseUnits("30", "gwei"), 
                maxPriorityFeePerGas: parseUnits("2", "gwei"),
                nonce, 
                chainId: 11155111, 
            };

            console.log('Transaction object:', tx);

            const txResponse = await wallet.sendTransaction(tx);
            console.log(`Transaction sent! Hash: ${txResponse.hash}`);

            const receipt = await txResponse.wait();
            console.log('Transaction confirmed!', receipt);

            let retries = 0;
            let transactionFound = false;

            while (retries < maxRetries && !transactionFound) {
                console.log(`Checking transactions... Attempt ${retries + 1}/${maxRetries}`);

                
                const fetchedTransactions = await walletService.fetchTransactions(data.toAddress);

                if (fetchedTransactions?.result && Array.isArray(fetchedTransactions.result)) {
              
                    transactionFound = fetchedTransactions.result.some((tx) => tx.hash === txResponse.hash);
                }

                if (!transactionFound) {
                    retries++;
                    console.log(`Transaction not found, retrying in ${retryInterval / 1000} seconds...`);
                    await new Promise((resolve) => setTimeout(resolve, retryInterval));
                }
            }

            if (transactionFound) {
                console.log("Transaction found in fetched transactions.");

                const transactionDetails = {
                    receipt,
                };

                const storedTransaction = await transactionModel.create({
                    blockNumber: transactionDetails.receipt.blockNumber,
                    from: transactionDetails.receipt.from,
                    to: transactionDetails.receipt.to,
                    index: transactionDetails.receipt.index,
                    status: transactionDetails.receipt.status,
                    hash: transactionDetails.receipt.hash,
                    logsBloom: transactionDetails.receipt.logsBloom,
                    blockHash: transactionDetails.receipt.blockHash,
                    transactionIndex: transactionDetails.receipt.transactionIndex,
                    gasPrice: transactionDetails.receipt.gasPrice,
                    contractAddress: transactionDetails.receipt.contractAddress,
                    cumulativeGasUsed: transactionDetails.receipt.cumulativeGasUsed.toString(),
                    gasUsed: transactionDetails.receipt.gasUsed.toString(),
                });

                console.log("Stored transaction:", storedTransaction);
                const getAddress = await walletModel.findOne({ address: storedTransaction.to });
                console.log(getAddress, "getAddress");
                const name = getAddress.aliasName;
                const message = `${name}  ${amountInEther}ETH received successfully`;
                const deviceToken = getAddress.deviceToken;
                const pushNotification = await adminService.pushNotification(deviceToken, message)
                console.log(pushNotification, "push")
                return storedTransaction;
            } else {
                console.log("Transaction not found after maximum retries.");
                throw new Error('Transaction not found after maximum retries.');
            }
        } catch (error) {
            console.error('Error sending transaction:', error.message || error);
            throw new Error(error.message || 'Internal server error');
        }
    }



}
export default walletService