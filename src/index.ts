import Express from 'express';
import dotenv from 'dotenv';
dotenv.config();

// All Routes
import { AllRoutes } from './allRoutes/route';

// Discord Provider
import { DiscordProvider } from './discord/route';

const app = Express();
const PORT = parseInt(process.env.SERVER_PORT as string) ?? 5000;

// Discord OAuth2
app.use('/discord', DiscordProvider);
app.use(AllRoutes);

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});
