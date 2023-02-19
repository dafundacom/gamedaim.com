import * as dotenv from "dotenv"

dotenv.config()

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  EMAIL_FROM: process.env.EMAIL_FROM,
  HOST_MAIL: process.env.HOST_MAIL,
  USER_MAIL: process.env.USER_MAIL,
  PASSWORD_MAIL: process.env.PASSWORD_MAIL,
  DEFAULT_ADMIN_EMAIL: process.env.DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD,
  R2_BUCKET: process.env.R2_BUCKET,
  R2_REGION: process.env.R2_REGION,
  R2_DOMAIN: process.env.R2_DOMAIN,
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
  R2_ACCESS_KEY: process.env.R2_ACCESS_KEY,
  R2_SECRET_KEY: process.env.R2_SECRET_KEY,
}

export default env
