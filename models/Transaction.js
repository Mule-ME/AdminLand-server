import mongoose from "mongoose";

const TransactionSchema = mongoose.Schema(
    {
        userId: { type: mongoose.Types.ObjectId, ref: "User" },
        cost: String,
        products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],

    },
    { timestamps: true }
);


const Transaction = mongoose.model("Transaction", TransactionSchema)
export default Transaction