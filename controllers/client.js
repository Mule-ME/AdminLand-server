import Product from "../models/Product.js";
import User from "../models/User.js";

export const getProducts = async (req, res) => {
    try {
        const productWithStat = await Product.aggregate([
            {
                $lookup: {
                    from: "productstats",
                    localField: "_id",
                    foreignField: "productId",
                    as: "status",
                },
            },
        ]);

        res.status(200).json(productWithStat);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getCustomers = async (req, res) => {
    try {
        const customers = await User.find({ role: "user" }).select("-password");
        res.status(200).json(customers);

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
