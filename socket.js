import { Server as SocketServer } from "socket.io";
import adminService from "./src/service/adminService.js";
import walletService from "./src/service/walletService.js";

function socket_server(server) {
    const io = new SocketServer(server, {
        cors: {
            origin: "*",
        },
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on("message", async () => {
            try {
                const transaction = await adminService.monitorTransactions();
                
                io.emit("transaction_update", { transaction });  
            } catch (error) {
                console.error("Error in monitortransactions:", error);
            }
        });

        socket.on("transactionMsg", async (data) => {
            console.log(data,"pppppppppppppp")
            console.log("hiiiiiii")
            try {
                const transaction = await walletService.sendTransaction(data);
                
                io.emit("transaction", { transaction });  
            } catch (error) {
                console.error("Error in monitortransactions:", error);
            }
        });



        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

export default socket_server;
