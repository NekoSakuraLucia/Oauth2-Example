import axios from 'axios';
import { Router, Request, Response } from 'express';
import qs from 'qs';

// BASE_URI
import { base_uri } from '../../config/base.api';

// ข้อมูลจาก .env และ Express Router
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI as string;
const router = Router();

// Types

/**
 * ข้อมูลประเภทจากส่วน บรรทัด: `112 / 79`
 *
 * ```ts
 * const { token_type, access_token } = response.data;
 * ```
 */
interface IResponseData {
    token_type: string;
    access_token: string;
    expires_in: number;
    scope: string;
    id_token: string;
}

/**
 * ข้อมูลประเภทมาจากส่วน `[GET]`: `/auth/callback`
 * เป็นประเภทสำหรับการรับข้อมูลผู้ใช้จาก Discord OAuth2 API
 */
interface IUserData {
    id: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
}

/**
 * ข้อมูลประเภทของการตอบกลับจาก Google OAuth2
 */
type QueryResponse = {
    code: string;
};

/**
 * ข้อมูลประเภทมาจากส่วน `[GET]`: `/auth` และ `[GET]`: `/auth/callback`
 * เป็นส่วน ที่ใช้ในการส่งค่าไปยัง Google OAuth2 API
 */
type QueryParam =
    | 'client_id'
    | 'client_secret'
    | 'code'
    | 'grant_type'
    | 'redirect_uri'
    | 'scope'
    | 'response_type';

/**
 * ข้อมูลประเภทมาจากส่วน `[GET]`: `/auth/callback`
 * สำหรับค่า Object ที่ส่งไปยัง Google OAuth2 API
 */
type CallbackParam = Omit<
    Record<QueryParam, string>,
    'scope' | 'response_type'
>;

/**
 * เป็นข้อมูลประเภทมาจากส่วน `[GET]`: `/auth`
 * สำหรับค่า Object ที่ส่งไปยัง Google OAuth2 API
 */
type AuthorizationParam = Omit<
    Record<QueryParam, string>,
    'client_secret' | 'code' | 'grant_type'
>;

router.get('/auth', (req: Request, res: Response) => {
    const queryParam: AuthorizationParam = {
        client_id: CLIENT_ID,
        response_type: 'code',
        scope: 'profile',
        redirect_uri: REDIRECT_URI,
    };

    const authorization =
        `${base_uri.google.account_uri}/o/oauth2/v2/auth?` +
        qs.stringify(queryParam);

    return res.redirect(authorization);
});

router.get(
    '/auth/callback',
    async (req: Request, res: Response): Promise<any> => {
        const code = (req.query as QueryResponse).code;

        const queryParam: CallbackParam = {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URI,
        };

        try {
            const response = await axios.post<IResponseData>(
                `${base_uri.google.oauth_uri}/token`,
                qs.stringify(queryParam),
                {},
            );

            const { token_type, access_token } = response.data;
            const responseData = await axios.get<IUserData>(
                `${base_uri.google.original_uri}/oauth2/v1/userinfo`,
                {
                    headers: {
                        Authorization: `${token_type} ${access_token}`,
                    },
                },
            );

            const user = responseData.data;
            return res.status(200).json(user);
        } catch (error) {
            console.error('Error during Google OAuth2 process:', error);
            return res.status(500).json({
                message: 'Internal Server Error',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    },
);

export { router as GoogleProvider };
