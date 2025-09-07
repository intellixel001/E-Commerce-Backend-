
import User from '../user/user.model';
import Payment from '../payment/payment.model';
import Product from '../product/product.model';
import Order from '../order/order.model';
import { TUser } from '../user/user.interface';
import mongoose from 'mongoose';

export class DashboardService {
    static async findDashboardByAdmin() {
        const user  = await User.aggregate([
            {
                $match:{
                    role:"user"
                }
            },
            {
                $group: {
                    _id: null,
                    total:{
                       $sum: 1
                    }
                },
            },
        ]);
        const total_revenue = await Payment.aggregate([
            {
                $match: {
                    status: 'paid',
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' },
                },
            },
        ]);
        const total_product = await Product.aggregate([
            {
                $match: {
                    status: true
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1},
                },
            },
        ]);
        const completed_orders = await Order.aggregate([
                {
                   $lookup: {
                      from: 'payments',
                      localField: 'payment',
                      foreignField: '_id',
                      pipeline: [
                        {
                            $project: {
                                status: 1,
                            },
                        },
                    ],
                    as: 'payment',
                },
                },
            {
                $unwind: {
                    path: '$payment',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: {
                    ["payment.status"]:"paid",
                    status: "completed"
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1},
                },
            },
        ]);
        const payment = await Payment.aggregate([
            {
                $match: {
                    status: 'paid',
                    createdAt: {
                        $gte: new Date(
                            new Date().setFullYear(
                                new Date().getFullYear() - 1,
                            ),
                        ),
                    },
                },
            },
            {
                $group: {
                    _id: {
                        payment_type: "$payment_type",
                        month: { $month: '$createdAt' },
                    },
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
        ]);
        const paymentTypes = ['product'];
        const monthLabels = Array.from({ length: 12 }, (_, i) => i + 1);
        const formattedPayment = paymentTypes.map((type) => ({
            name: type.charAt(0).toUpperCase() + type.slice(1),
            data: monthLabels.map((month) => {
                const found = payment.find((item:any) => item._id.payment_type === type && item._id.month === month);
                return found ? found.totalAmount : 0;
            }),
        }));
        return {
            total_user: user[0].total || 0,
            total_revenue: total_revenue[0]?.total || 0,
            formattedPayment: formattedPayment,
            total_product: total_product[0]?.total || 0,
            completed_orders: completed_orders[0]?.total || 0
        };
    }
     static async findDashboardByUser(user:TUser) {
        const total_order = await Order.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(user._id),
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1},
                },
            },
        ]);
        const completed_order = await Order.aggregate([
                {
                   $lookup: {
                      from: 'payments',
                      localField: 'payment',
                      foreignField: '_id',
                      pipeline: [
                        {
                            $project: {
                                status: 1,
                            },
                        },
                    ],
                    as: 'payment',
                },
                },
            {
                $unwind: {
                    path: '$payment',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: {
                    user: new mongoose.Types.ObjectId(user._id),
                    ["payment.status"]:"paid",
                    status: "completed"
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1},
                },
            },
        ]);
        const panding_order = await Order.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(user._id),
                    status: {
                        $in:["accepted" , "pending"]
                    }
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1},
                },
            },
        ]);
        const cancelled_order = await Order.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(user._id),
                    status: {
                        $in:["cancelled"]
                    }
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1},
                },
            },
        ]);
        return {
            total_order: total_order[0]?.total || 0,
            completed_order:completed_order[0]?.total || 0,
            panding_order:panding_order[0]?.total || 0,
            cancelled_order:cancelled_order[0]?.total || 0
        };
    }
}

