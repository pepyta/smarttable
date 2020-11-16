const config = {
    google: {
        id: process.env.GOOGLE_ID,
        secret: process.env.GOOGLE_secret,
        email: {
            address: process.env.GOOGLE_EMAIL_ID,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        },
    },
    website: process.env.TARGET_URL,
};

export default config;