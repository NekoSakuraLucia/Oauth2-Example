import Express from 'express';
import dotenv from 'dotenv';
dotenv.config();

// All Routes
import { AllRoutes } from './allRoutes/route';

// Discord Provider
import { DiscordProvider } from './providers/discord/route';

// Google Provider
import { GoogleProvider } from './providers/google/route';

// Spotify Provider
import { SpotifyProvider } from './providers/spotify/route';

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

        // Google Provider
        this.app.use('/google', GoogleProvider);

        // Spotify Provider
        this.app.use('/spotify', SpotifyProvider);
    }

    public start(): void {
        this.app.listen(SERVER_PORT, () => {
            console.log(`Server Running on PORT ${SERVER_PORT}`);
        });
    }
}

const server = new Started();
server.start();
