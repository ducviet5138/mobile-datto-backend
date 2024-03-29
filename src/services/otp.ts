import { Request } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import { OTP } from '@/entities';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();
import generateOTP from '@/utils/generateOTP';
import objectIdConverter from '@/utils/objectIdConverter';


const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT),
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

class OTPService {
    repository = OTP;

    async sendOTP(req: Request) {
        try {
            const { email } = req.body;

            const otp = new OTP({
                code: generateOTP(),
            });
            
            const data = await otp.save();

            // Send OTP to users' email
            await transporter.sendMail({
                from: `"Datto" <${process.env.MAIL_USER}>`,
                to: `${email}`,
                subject: '[Datto] OTP',
                html: `
                    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                    <div style="margin:50px auto;width:70%;padding:20px 0">
                        <div style="border-bottom:1px solid #eee">
                        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Datto</a>
                        </div>
                        <p style="font-size:1.1em">Hi,</p>
                        <p>Thank you for using Datto. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
                        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${data.code}</h2>
                        <p style="font-size:0.9em;">Regards,<br />Datto</p>
                        <hr style="border:none;border-top:1px solid #eee" />
                        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                        <p>Datto Inc</p>
                        </div>
                    </div>
                    </div>
                    `,
            });

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data._id);
        } catch (_: any) {
            console.log(_);
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async verifyOTP(req: Request) {
        try {
            const { otpId, code } = req.body;
            const otp = await this.repository.findOne({ _id: objectIdConverter(otpId), code });

            if (!otp) {
                return new BaseResponse(RET_CODE.ERROR, false, 'Invalid OTP');
            }

            await this.repository.deleteOne({ _id: objectIdConverter(otpId) });

            // Check if OTP is expired
            const now = new Date();
            if (now > otp.expiredAt) {
                return new BaseResponse(RET_CODE.ERROR, false, 'OTP is expired');
            }

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

export default new OTPService();
