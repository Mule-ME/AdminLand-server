import Product from "../models/Product.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const getProducts = async (req, res) => {
    try {
        const productWithStat = await Product.aggregate([
            {
                $lookup: {
                    from: "productstats",
                    localField: "_id",
                    foreignField: "productId",
                    as: "stat",
                },

            },
            {
                $unwind: "$stat",
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

export const getTransactions = async (req, res) => {
    try {

        //sort should look like this : {"fields: "userId", "sort": "dec"}
        const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

        //Search query
        const searchQuery = new RegExp(search, "i");


        //formatted sort should look like {userId: -1}
        const generateSort = () => {
            const sortParsed = JSON.parse(sort);
            const sortFormatted = {
                [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
            };

            return sortFormatted;
        };

        const sortFormatted = Boolean(sort) ? generateSort : {};

        const aggregationPipeline = [
            {
                $lookup: {
                    from: "products",
                    localField: "products",
                    foreignField: "_id",
                    as: "products",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },


            {
                $unwind: "$user",
            },
            {
                $project: {
                    cost: 1,
                    createdAt: 1,
                    user: {
                        name: 1,
                        phoneNumber: 1,
                        country: 1,

                    },
                    products: 1,

                },
            }
        ];

        // console.log("Aggregation Pipeline:", JSON.stringify(aggregationPipeline, null, 2));


        // Conditionally add $match stage if search is not empty
        if (search) {
            aggregationPipeline.push({
                $match: {
                    $or: [
                        {
                            cost: { $regex: searchQuery },
                        },
                        {
                            "user.name": { $regex: searchQuery },
                        },
                    ],
                },
            });
        }

        // Conditionally add $sort stage if sortFormatted is not empty
        if (Object.keys(sortFormatted).length > 0) {
            aggregationPipeline.push({ $sort: sortFormatted });
        }

        const transaction = await Transaction.aggregate(aggregationPipeline)
            .skip(page * pageSize)
            .limit(Number(pageSize));

        const total = await Transaction.count({
            $or: [
                { cost: { $regex: searchQuery } },
                { "user.name": { $regex: searchQuery } },
            ],
        });

        res.status(200).json({ data: transaction, total });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
