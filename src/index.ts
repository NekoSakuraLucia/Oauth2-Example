import Express from 'express';
import dotenv from 'dotenv';
dotenv.config();

// All Routes
import { AllRoutes } from './allRoutes/route';

// Discord Provider
import { DiscordProvider } from './discord/route';

// constant
const SERVER_PORT = parseInt(process.env.SERVER_PORT as string) ?? 5000;

class Started {
    public app: Express.Application;

    constructor() {
        this.app = Express();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // All Routes
        this.app.use(AllRoutes);

        // Discord Provider
        this.app.use('/discord', DiscordProvider);
    }
}

const server = new Started();
server.app.listen(SERVER_PORT, () =>
    console.log(`Server Running on PORT ${SERVER_PORT}`)
);
