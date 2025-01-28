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



const apiKey = await Moralis.start({
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjNmMzhlOTAyLTdlNGYtNGU5Zi05NTBiLTU4ZjU3N2JjYzQ4NSIsIm9yZ0lkIjoiMzk4MDMxIiwidXNlcklkIjoiNDA4OTkyIiwidHlwZUlkIjoiMzEyZGY1Y2UtY2QzMC00Yzc0LWFiNjQtMDY3NzRkZDYwYTkwIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MTk0OTAxOTYsImV4cCI6NDg3NTI1MDE5Nn0.KTIJqXydFFysWU5fI1lzJ2lWMbj8E5CNiUotW-HZAfk",
});

const INFURA_URL = `https://sepolia.infura.io/v3/67048bd8b88444cbb4d0aee7adcbffd1`;

// Initialize the provider
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
        const { privateKey, toAddress, amountInEther } = data;
        const maxRetries = 10; // Maximum number of retries (adjust as necessary)
        const retryInterval = 5000; // Interval between retries in milliseconds (5 seconds)

        try {
            const formattedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;

            // Validate private key format
            if (!isValidPrivateKey(formattedPrivateKey)) {
                throw new Error('Invalid private key format. Ensure it is a valid 64-character hexadecimal string prefixed with "0x".');
            }

            // Create wallet instance
            const wallet = new ethers.Wallet(formattedPrivateKey, provider);

            // Get wallet nonce
            const nonce = await provider.getTransactionCount(wallet.address);
            console.log(`Wallet Address: ${wallet.address}`);
            console.log(`Nonce: ${nonce}`);

            // Create the transaction
            const tx = {
                to: toAddress,
                value: parseEther(amountInEther), // Amount to send
                gasLimit: 21000, // Gas limit for basic ETH transfer
                maxFeePerGas: parseUnits("30", "gwei"), // Adjust gas price
                maxPriorityFeePerGas: parseUnits("2", "gwei"),
                chainId: 11155111, // Sepolia testnet chain ID
            };

            console.log('Transaction object:', tx);

            // Sign and send the transaction
            const txResponse = await wallet.sendTransaction(tx);
            console.log(`Transaction sent! Hash: ${txResponse.hash}`);

            // Wait for confirmation
            const receipt = await txResponse.wait();
            console.log('Transaction confirmed!', receipt);

            // Initialize retry logic
            let retries = 0;
            let transactionFound = false;

            while (retries < maxRetries && !transactionFound) {
                console.log(`Checking transactions... Attempt ${retries + 1}/${maxRetries}`);

                // Fetch transactions for the address
                const getTraction = await walletService.fetchTransactions(toAddress);

                console.log("Fetched transactions:", getTraction);

                if (getTraction && getTraction.result && Array.isArray(getTraction.result)) {
                    // Loop through each transaction in the result array
                    for (let tx of getTraction.result) {
                        console.log(`Comparing ${tx.hash} with ${txResponse.hash}`); // Debugging comparison

                        if (tx.hash === txResponse.hash) {
                            transactionFound = true;
                            break;
                        }
                    }
                }

                if (!transactionFound) {
                    retries++;
                    console.log(`Transaction not found, retrying in ${retryInterval / 1000} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, retryInterval)); // Wait for retry interval
                }
            }

            // Return response if transaction is found after retries
            if (transactionFound) {
                console.log("Transaction found in fetched transactions.");
                return {
                    transactionHash: txResponse.hash,
                    receipt,
                };
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