import jwt from 'jsonwebtoken';
import {APIGatewayProxyEventHeaders} from 'aws-lambda';
import publicKeyString from '../constants/publicKeys';
import { AuthResponseCodes } from '../constants/responseCodes/auth';
import { User } from '../../entities/User';
import { DecodedToken } from '../types/auth';

const JWT_SECRET =  'pizzahut';

export const decodeToken = (headers: APIGatewayProxyEventHeaders): DecodedToken => {
    if (!headers || !headers.Authorization) {
        throw {
            message: 'Need an Authorization header',
            code: 401,
            statusCode: AuthResponseCodes.NO_TOKEN,
        };
    }

    const publicKey = Buffer.from(publicKeyString['local'], 'utf-8');

    try {
        const decoded: any = jwt.verify(headers.Authorization, publicKey);

        return {
            email: decoded.email,
            exp: decoded.exp,
            iat: decoded.iat,
            sub: decoded.id,
        };
    } catch (error) {
        console.log(`There was an error decoding the token : ${error}`);
        throw {
            message: 'The jwt token is invalid',
            code: 401,
            statusCode: AuthResponseCodes.INVALID_TOKEN,
        };
    }
};

export const generateUserToken = (user: User) => {
    // const options: jwt.SignOptions = { algorithm: 'RS256' };

    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET as string);
};
