const BASE_URI = {
    discord: {
        original_uri: 'https://discord.com/api/v10',
    },
    google: {
        account_uri: 'https://accounts.google.com',
        oauth_uri: 'https://oauth2.googleapis.com',
        original_uri: 'https://www.googleapis.com',
    },
    spotify: {
        account_uri: 'https://accounts.spotify.com',
        original_uri: 'https://api.spotify.com/v1',
    },
} as const;

export { BASE_URI as base_uri };
