import type { Request, Response } from 'express';

declare global {
    interface IExpressRES {
        req: Request;
        res: Response;
    }
}

export {};
