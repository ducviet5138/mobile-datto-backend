// ========================================================
// Set up database and express server
import * as express from "express"
import "reflect-metadata"
import { myDataSource } from "./app-data-src"
import 'module-alias/register'

const app = express()
const port = 3000;
app.use(express.json())

const startServer = async () => {
    try {
        await myDataSource.initialize();
        console.log("[Database] Database has been initialized!");

        app.listen(port, () => {
            console.log(`[Server] Server is running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("[Database] Error: ", err);
    }
}

startServer();

// ========================================================
// Set up routes 
import router from "./routes"
app.use("/", router); 