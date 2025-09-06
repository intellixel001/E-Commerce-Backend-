
import User from '../user/user.model';
import Payment from '../payment/payment.model';

export class DashboardService {
    static async findDashboard() {
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
            total_revenue:total_revenue[0].total || 0,
            formattedPayment:formattedPayment
        };
    }
   
}

