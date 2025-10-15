const env = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    TARGET_DB: process.env.TARGET_DB,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_HOST: process.env.EMAIL_HOST,
}

export default env;