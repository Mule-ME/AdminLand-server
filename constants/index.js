import dotenv from 'dotenv'

dotenv.config()

//ENVIRONMENT VARIABLES 
export const APP_NODE_ENV = process.env.NODE_ENV
export const APP_PORT = process.env.PORT
export const APP_MONGO_URL = process.env.MONGO_URL
export const APP_SECRET = process.env.JWT_SECRET



