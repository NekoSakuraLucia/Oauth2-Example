import axios from 'axios';
import { Router, Request, Response } from 'express';
import qs from 'qs';

// BASE_URI
import { base_uri } from '../../config/base.api';

// ข้อมูลจาก .env และ Express Router
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID as string;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET as string;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI as string;
const router = Router();

// Types

/**
 * ข้อมูลประเภทจากส่วน บรรทัด: `144 / 79`
 *
 * ```ts
 * const { token_type, access_token } = response.data;
 * ```
 */
interface IResponseData {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
}

/**
 * ข้อมูลประเภทมาจากส่วน `[GET]`: `/auth/callback`
 * เป็นประเภทสำหรับการรับข้อมูลผู้ใช้จาก Spotify OAuth2 API
 */
interface IUserData {
    country: string;
    display_name: string;
    email: string;
    explicit_content: ExplicitContent;
    external_urls: ExternalUrls;
    followers: Followers;
    href: string;
    id: string;
    images: Image[];
    product: string;
    type: string;
    uri: string;
}

interface ExplicitContent {
    filter_enabled: boolean;
    filter_locked: boolean;
}

interface ExternalUrls {
    spotify: string;
}

interface Followers {
    href: any;
    total: number;
}

interface Image {
    height: number;
    url: string;
    width: number;
}

/**
 * ข้อมูลประเภทของการตอบกลับจาก Spotify OAuth2
 */
type QueryResponse = {
    code: string;
};

/**
 * ข้อมูลประเภทมาจากส่วน `[GET]`: `/auth` และ `[GET]`: `/auth/callback`
 * เป็นส่วน ที่ใช้ในการส่งค่าไปยัง Spotify OAuth2 API
 */
type QueryParam =
    | 'client_id'
    | 'code'
    | 'grant_type'
    | 'redirect_uri'
    | 'scope'
    | 'response_type';

/**
 * ข้อมูลประเภทมาจากส่วน `[GET]`: `/auth/callback`
 * สำหรับค่า Object ที่ส่งไปยัง Spotify OAuth2 API
 */
type CallbackParam = Omit<
    Record<QueryParam, string>,
    'scope' | 'response_type' | 'client_id'
>;

/**
 * เป็นข้อมูลประเภทมาจากส่วน `[GET]`: `/auth`
 * สำหรับค่า Object ที่ส่งไปยัง Spotify OAuth2 API
 */
type AuthorizationParam = Omit<
    Record<QueryParam, string>,
    'code' | 'grant_type'
>;

router.get('/auth', (req: Request, res: Response): any => {
    const queryParam: AuthorizationParam = {
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        scope: 'user-read-private user-read-email user-top-read',
    };
    const authorization = `${
        base_uri.spotify.account_uri
    }/authorize?${qs.stringify(queryParam)}`;

    return res.redirect(authorization);
});

router.get(
    '/auth/callback',
    async (req: Request, res: Response): Promise<any> => {
        const code = (req.query as QueryResponse).code;

        const queryParam: CallbackParam = {
            code: code,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
        };

        try {
            const response = await axios.post<IResponseData>(
                `${base_uri.spotify.account_uri}/api/token`,
                qs.stringify(queryParam),
                {
                    headers: {
                        Authorization:
                            'Basic ' +
                            Buffer.from(
                                `${CLIENT_ID}:${CLIENT_SECRET}`
                            ).toString('base64'),
                    },
                }
            );

            const { token_type, access_token } = response.data;
            const responseData = await axios.get<IUserData>(
                `${base_uri.spotify.original_uri}/${base_uri.spotify.version}/me`,
                {
                    headers: {
                        Authorization: `${token_type} ${access_token}`,
                    },
                }
            );

            const user = responseData.data;
            return res.status(200).json(user);
        } catch (error) {
            console.error('Error during Spotify OAuth2 process:', error);
            return res.status(500).json({
                message: 'Internal Server Error',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
);

export { router as SpotifyProvider };
