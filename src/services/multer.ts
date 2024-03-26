import * as multer from 'multer';
import { Bucket } from '../entities';
import { myDataSource } from "../app-data-src"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './my_bucket/');
    },
    filename: async (req, file, cb) => {
        const bucket = new Bucket();
        bucket.fileName = file.originalname;

        const entity = await myDataSource.manager.save(bucket);
        cb(null, entity._id.toHexString());

        // Rename the file
        file.filename = entity._id.toHexString();
    }
    });


const upload = multer({ storage: storage });

export default upload;