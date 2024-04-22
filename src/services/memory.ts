import { Request } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import { Group, Memory } from '@/entities';
import objectIdConverter from '@/utils/objectIdConverter';

class MemoryService {
    repository = Memory;

    async create(req: Request) {
        try {
            const groupId = objectIdConverter(req.params.groupId);

            // Get group
            const group = await Group.findById(groupId);
            if (!group) return new BaseResponse(RET_CODE.ERROR, false, 'Cannot find group with id ' + groupId);

            const { thumbnail, info } = req.body;

            // Check valid data
            if (!thumbnail || !info) return new BaseResponse(RET_CODE.BAD_REQUEST, false, RET_MSG.BAD_REQUEST);

            const memory = new Memory({
                thumbnail,
                info,
            });

            // Save memory
            const data = await memory.save();

            // Append new data to group
            group.memories.push(data._id);
            await group.save();

            return new BaseResponse(RET_CODE.SUCCESS, true, 'New memory object added');
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async patch(req: Request) {
        try {
            const groupId = objectIdConverter(req.params.groupId);

            // Get group
            const group = await Group.findById(groupId);
            if (!group) return new BaseResponse(RET_CODE.ERROR, false, 'Cannot find group with id ' + groupId);

            const id = objectIdConverter(req.params.id);
            const { thumbnail, info } = req.body;

            // Check valid data
            if (!thumbnail || !info) return new BaseResponse(RET_CODE.BAD_REQUEST, false, RET_MSG.BAD_REQUEST);

            // Update memory
            await this.repository.findByIdAndUpdate(id, {
                thumbnail,
                info,
            });

            return new BaseResponse(RET_CODE.SUCCESS, true, 'Memory updated');
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async get(req: Request) {
        try {
            const groupId = objectIdConverter(req.params.groupId);

            // Get group
            const group = await Group.findById(groupId);
            if (!group) return new BaseResponse(RET_CODE.ERROR, false, 'Cannot find group with id ' + groupId);

            const id = objectIdConverter(req.params.id);
            const memory = await this.repository.findById(id);
            if (!memory) return new BaseResponse(RET_CODE.ERROR, false, 'Cannot find memory with id ' + id);

            return new BaseResponse(RET_CODE.SUCCESS, true, 'Get single memories', memory);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async getAll(req: Request) {
        try {
            const groupId = objectIdConverter(req.params.groupId);

            // Get group
            const group = await Group.findById(groupId);
            if (!group) return new BaseResponse(RET_CODE.ERROR, false, 'Cannot find group with id ' + groupId);

            const memories = (await this.repository.find({ _id: { $in: group.memories } })).reverse();
            return new BaseResponse(RET_CODE.SUCCESS, true, 'Get all memories', memories);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async delete(req: Request) {
        try {
            const groupId = objectIdConverter(req.params.groupId);

            // Get group
            const group = await Group.findById(groupId);
            if (!group) return new BaseResponse(RET_CODE.ERROR, false, 'Cannot find group with id ' + groupId);

            const id = objectIdConverter(req.params.id);

            // Delete memory
            await this.repository.findByIdAndDelete(id);

            // Remove memory from group
            group.memories = group.memories.filter((memory) => memory.toString() != id.toString());

            await group.save();

            return new BaseResponse(RET_CODE.SUCCESS, true, 'Memory deleted');
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

export default new MemoryService();
