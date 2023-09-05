import mongoose from "mongoose";

const ProductSchema = mongoose.Schema(
    {
        name: String,
        price: String,
        description: String,
        category: String,
        rating: String,
        supply: String,

    },
    { timestamps: true }
);


const Product = mongoose.model("Product", ProductSchema)
export default Product