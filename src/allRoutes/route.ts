import { Router, Request, Response } from 'express';

const allRoutes = [
    {
        name: 'Discord Provider',
        description: 'Discord OAuth2 Provider',
        routes: ['/discord/auth', '/discord/auth/callback'],
    },
    {
        name: 'Google Provider',
        description: 'Google OAuth2 Provider',
        routes: ['/google/auth', '/google/auth/callback'],
    },
];

const router = Router();

router.get('/', (req: Request, res: Response): any => {
    return res.json(allRoutes);
});

export { router as AllRoutes };
