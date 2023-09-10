import User from "../models/User.js";
import OverallStat from "../models/OverallStat.js";
import Transaction from "../models/Transaction.js";

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select();
        res.status(200).json({ data: user });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const { currentMonth, currentYear, currentDay } = req.query;

        /* Recent Transactions */
        const transactions = await Transaction.aggregate([
            {
                $limit: 50,
            },
            {
                $sort: { createdOn: -1 },
            },
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
            },
        ]);

        /* Overall Stats */
        const overallStat = await OverallStat.aggregate([
            { $match: { year: Number(currentYear) } },
            {
                $addFields: {
                    currentMonthStats: {
                        $filter: {
                            input: "$monthlyData",
                            as: "monthData",
                            cond: { $eq: ["$$monthData.month", currentMonth?.toString()] },
                        },
                    },
                },
            },
            {
                $addFields: {
                    currentDayStats: {
                        $filter: {
                            input: "$dailyData",
                            as: "dailyData",
                            cond: { $eq: ["$$dailyData.date", currentDay?.toString()] },
                        },
                    },
                },
            },
        ]);

        res.status(200).json({
            data: {
                overallStat,
                transactions,
            },
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
