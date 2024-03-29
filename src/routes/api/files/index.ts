import * as Express from 'express';
import { Request, Response } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import { Bucket } from '@/entities';
import upload from '@/services/multer';
import objectIdConverter from '@/utils/objectIdConverter';
import { createReadStream } from 'fs';
import * as fs from 'fs/promises';

const router = Express.Router();

// POST: /api/files
// Feat: Upload a file
router.post('/', upload.single('file'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.BAD_REQUEST);
            res.status(response.getRetCode()).json(response.getResponse());
            return;
        }

        const id = req.file.filename;

        // Check if id is valid
        // const entity = await myDataSource.manager.findOneBy(Bucket, {
        //     _id: new ObjectId(id),
        // });
        const entity = await Bucket.findById(objectIdConverter(id));

        if (!entity) {
            const response = new BaseResponse(RET_CODE.BAD_REQUEST, false, RET_MSG.BAD_REQUEST);
            res.status(response.getRetCode()).json(response.getResponse());
            return;
        }

        const response = new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
            id: entity._id,
        });

        res.status(response.getRetCode()).json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.status(response.getRetCode()).json(response.getResponse());
    }
});


// GET: /api/files/:id
// Feat: Get all files
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        // Check if id is valid
        // const entity = await myDataSource.manager.findOneBy(Bucket, {
        //     _id: new ObjectId(id),
        // });

        const entity = await Bucket.findById(objectIdConverter(id));

        if (!entity) {
            const response = new BaseResponse(RET_CODE.BAD_REQUEST, false, RET_MSG.BAD_REQUEST);
            res.status(response.getRetCode()).json(response.getResponse());
            return;
        }

        // Create a read stream
        res.setHeader('Content-Disposition', `inline; filename=${entity.fileName}`);
        const readStream = createReadStream(`./my_bucket/${entity._id}`);
        readStream.pipe(res);
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.status(response.getRetCode()).json(response.getResponse());
    }
});

// DELETE: /api/files
// Feat: Delete a file
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        // Check if id is valid
        // const entity = await myDataSource.manager.findOneBy(Bucket, {
        //     _id: new ObjectId(id),
        // });

        const entity = await Bucket.findById(objectIdConverter(id));

        if (!entity) {
            const response = new BaseResponse(RET_CODE.BAD_REQUEST, false, RET_MSG.BAD_REQUEST);
            res.status(response.getRetCode()).json(response.getResponse());
            return;
        }

        // Delete the file in database
        // await myDataSource.manager.delete(Bucket, {
        //     _id: new ObjectId(id),
        // });
        await Bucket.deleteOne({ _id: objectIdConverter(id) });

        // Delete the file in storage
        await fs.unlink(`./my_bucket/${entity._id}`);
        
        const response = new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS);
        res.status(response.getRetCode()).json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.status(response.getRetCode()).json(response.getResponse());
    }
});

export default router;
