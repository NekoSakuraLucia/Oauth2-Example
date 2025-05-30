import { Request, Response, Router } from 'express';
import axios from 'axios';
import qs from 'qs';

// BASE_URI
import { base_uri } from '../config/base.api';

const router = Router();

// Types
/**
 * ข้อมูลประเภทจากส่วน บรรทัด: `82 / 74`
 *
 * ```ts
 * const { token_type, access_token } = response.data;
 * ```
 */
interface IResponseData {
    token_type: string;
    access_token: string;
}

/**
 * ข้อมูลประเภทมาจากส่วน `[GET]`: `/auth/callback`
 * เป็นประเภทสำหรับการรับข้อมูลผู้ใช้จาก Discord API
 */
interface IUserData {
    id: string;
    username: string;
    avatar: string;
    global_name: string;
    clan: {
        identity_guild_id: string;
        identity_enabled: boolean;
        tag: string;
        badge: string;
    };
    primary_guild: {
        identity_guild_id: string;
        identity_enabled: boolean;
        tag: string;
        badge: string;
    };
    email: string;
    verified: boolean;
}

/**
 * ข้อมูลประเภทมาจากส่วน `[GET]`: `/auth` และ `[GET]`: `/auth/callback`
 *
 *
 * เป็นส่วน ที่ใช้ในการส่งค่าไปยัง Discord API
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
 */
type CallbackParam = Omit<
    Record<QueryParam, string>,
    'scope' | 'response_type'
>;

/**
 * ข้อมูลประเภทมาจากส่วน `[GET]`: `/auth`
 */
type AuthorizationParam = Omit<
    Record<QueryParam, string>,
    'client_secret' | 'code' | 'grant_type'
>;

// ข้อมูลจาก .env
const CLIENT_ID = process.env.CLIENT_ID as string;
const CLIENT_SECRET = process.env.CLIENT_SECRET as string;
const REDIRECT_URI = process.env.REDIRECT_URI as string;

router.get('/auth', (req: Request, res: Response) => {
    const queryParam: AuthorizationParam = {
        client_id: CLIENT_ID,
        response_type: 'code',
        scope: 'identify',
        redirect_uri: REDIRECT_URI,
    };

    const authorization = `${
        base_uri.discord.uri
    }/oauth2/authorize?${qs.stringify(queryParam)}`;

    res.redirect(authorization);
});

router.get(
    '/auth/callback',
    async (req: Request, res: Response): Promise<any> => {
        const code = (req.query as { code: string }).code;

        const queryParam: CallbackParam = {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URI,
        };

        try {
            const response = await axios.post(
                `${base_uri.discord.uri}/api/${base_uri.discord.version}/oauth2/token`,
                qs.stringify(queryParam),
                {}
            );

            const { token_type, access_token }: IResponseData = response.data;
            const responseUser = await axios.get(
                `${base_uri.discord.uri}/api/${base_uri.discord.version}/users/@me`,
                {
                    headers: {
                        Authorization: `${token_type} ${access_token}`,
                    },
                }
            );

            const user = responseUser.data as IUserData;
            const responseUserData: IUserData = {
                id: user.id || '',
                username: user.username || '',
                avatar: user.avatar || '',
                global_name: user.global_name || '',
                clan: {
                    identity_guild_id: user.clan?.identity_guild_id || '',
                    identity_enabled: user.clan?.identity_enabled ?? true,
                    tag: user.clan?.tag || '',
                    badge: user.clan?.badge || '',
                },
                primary_guild: {
                    identity_guild_id:
                        user.primary_guild?.identity_guild_id || '',
                    identity_enabled:
                        user.primary_guild?.identity_enabled ?? true,
                    tag: user.primary_guild?.tag || '',
                    badge: user.primary_guild?.badge || '',
                },
                email: user.email || '',
                verified: user.verified ?? true,
            };

            return res.status(200).json(responseUserData);
        } catch (error) {
            console.error('Error during Discord OAuth2 process:', error);
            return res.status(500).json({
                message: 'Internal Server Error',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
);

export { router as DiscordProvider };
