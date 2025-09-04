import dotenv from 'dotenv';
import path from 'node:path';
const envPath: string = path.join(
    __dirname,
    '../../../',
    `.env.${process.env.NODE_ENV}`,
)
dotenv.config({ path: envPath });
export default {
    db_string: process.env.DB_STRING,
    port: process.env.PORT || 2025,
    website_name: process.env.WEBSITE_NAME,
    node_env: process.env.NODE_ENV || "dev",

    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,

    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};
