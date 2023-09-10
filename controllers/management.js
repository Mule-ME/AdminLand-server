import mongoose from "mongoose";
import User from "../models/User.js";

export const getAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: "admin" }).select("-password");
        res.status(200).json({ data: admins });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getUserPerformance = async (req, res) => {
    try {
        const { id } = req.params;

        const userWithSales = await User.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id) },
            },
            {
                $lookup: {
                    from: "affiliatestats",
                    localField: "_id",
                    foreignField: "userId",
                    as: "affiliateStats",
                },
            },
            {
                $unwind: "$affiliateStats",
            },
            {
                $lookup: {
                    from: "transactions",
                    let: { affiliateSales: "$affiliateStats.affiliateSales" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $in: ["$_id", "$$affiliateSales"] },
                                        { $eq: ["$userId", new mongoose.Types.ObjectId(id)] }
                                    ]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "userId",
                                foreignField: "_id",
                                as: "user",
                            }
                        },
                        {
                            $unwind: "$user"
                        },
                    ],
                    as: "saleTransactions",
                },
            },
            {
                $addFields: {
                    saleTransactions: {
                        $filter: {
                            input: "$saleTransactions",
                            as: "transaction",
                            cond: { $ne: ["$$transaction", null] }
                        }
                    }
                }
            }
        ]);


        if (userWithSales.length === 0) {
            res.status(404).json({ message: "User not found" });
        } else {
            res
                .status(200)
                .json({
                    data: {
                        user: userWithSales[0],
                        sales: userWithSales[0].saleTransactions,
                    }
                });
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
