import { Router } from 'express';

const allRoutes = [
    {
        name: 'Discord Provider',
        description: 'Discord OAuth2 Provider',
        routes: ['/discord/auth', '/discord/auth/callback'],
    },
];

const router = Router();

router.get('/', (req, res) => {
    res.json(allRoutes);
});

export { router as AllRoutes };
