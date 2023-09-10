import mongoose from "mongoose"
import { APP_MONGO_URL } from "../constants/index.js"


//dump data imports
import User from "../models/User.js"
import Product from "../models/Product.js"
import ProductStat from "../models/ProductStat.js"
import Transaction from "../models/Transaction.js"
import OverallStat from "../models/OverallStat.js"
import AffiliateStat from "../models/AffiliateStat.js"
import { dataUser, dataProduct, dataProductStat, dataTransaction, dataOverallStat, dataAffiliateStat } from "../data/index.js"

const connectDB = async () => {
    try {

        const conn = await mongoose.connect(APP_MONGO_URL)
        console.log(
            `MongoDB Connected to ${conn.connection.host}`.magenta.underline
        );

        //HERE_IS_THE_DATA_INJECTOR_TRY_TO_ADD_DATA_ONLY_ONE_TIME
        // User.insertMany(dataUser)
        // Product.insertMany(dataProduct)
        // ProductStat.insertMany(dataProductStat)
        // Transaction.insertMany(dataTransaction)
        // OverallStat.insertMany(dataOverallStat)
        // AffiliateStat.insertMany(dataAffiliateStat)

    } catch (error) {
        console.log(error)
        process.exit(1)

    }
}


export default connectDB