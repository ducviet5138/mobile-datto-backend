// ========================================================
// Set up database and express server
import * as express from "express"
import "reflect-metadata"
import { Request, Response } from "express"
import { myDataSource } from "./app-data-src"

const app = express()
const port = process.env.PORT || 3000;
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


// app.get("/", (req: Request, res: Response) => {
//   res.send("Express + TypeScript Server");
// });

// import { Bucket } from "./entities/"
// import upload from "./services/multer"

// app.post("/", upload.single('file'), async (req: Request, res: Response) => {
//     console.log(req.body)

//     const bucket = new Bucket()
//     bucket.fileName = req.body.fileName
    
//     await myDataSource.manager.save(bucket)
//     res.send("Completed!")
// });
  