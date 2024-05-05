import * as dotenv from 'dotenv';
dotenv.config();
import * as jwt from 'jsonwebtoken';

export default function generateJWTToken(data: Object) {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '7d' });
}
