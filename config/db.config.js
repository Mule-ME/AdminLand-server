import mongoose from "mongoose"
import { APP_MONGO_URL } from "../constants/index.js"


//dump data imports
import User from "../models/User.js"
import Product from "../models/Product.js"
import ProductStat from "../models/ProductStat.js"
import { dataUser, dataProduct, dataProductStat } from "../data/index.js"

const connectDB = async () => {
    try {

        const conn = await mongoose.connect(APP_MONGO_URL)
        console.log(
            `MongoDB Connected to ${conn.connection.host}`.magenta.underline
        );

        //ONLY_ADD_DATA_ONE_TIME
        // User.insertMany(dataUser)
        // Product.insertMany(dataProduct)
        // ProductStat.insertMany(dataProductStat)

    } catch (error) {
        console.log(error)
        process.exit(1)

    }
}


export default connectDB