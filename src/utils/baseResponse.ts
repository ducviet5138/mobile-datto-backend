export default class BaseResponse {
    success: boolean;
    message: string;
    data: any;

    constructor(newSuccess: boolean, newMessage: string, newData: any = {}) {
        this.success = newSuccess;
        this.message = newMessage || '';
        this.data = newData || {};
    }
}