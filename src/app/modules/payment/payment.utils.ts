import { Types } from "mongoose";
import { generateRandomNumber } from "../../utils/helpers";
import Payment from "./payment.model";
import { TUser } from "../user/user.interface";

export const generateTransactionId = async (
    prefix: string,
): Promise<string> => {
    const randomString =
        prefix + String.fromCharCode(...generateRandomNumber(7, 32));
    const exists = await Payment.findOne(
        { transaction_id: randomString });
    if (exists) {
        console.error('Matched!', randomString);
        return await generateTransactionId(prefix);
    }
    return randomString;
};

export const  executeSslcommerzPayment  = async(
{
    user,
    amount,
    payment_type,
    order_id,
    tran_id
}:{
     user: TUser
     amount: number;
     payment_type: string;
     order_id: Types.ObjectId;
     tran_id: string
})=>{
    //     const store_id = sslCommerzConfig?.config?.clientId;
    //     const store_passwd = sslCommerzConfig?.config?.clientSecret;
    //     const is_live = sslCommerzConfig?.config?.is_live
    //     const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    //     const customerAddress = user.address || user.address || 'N/A';

    //             const data = {
    //                 total_amount: parseFloat(subsPrice),
    //                 currency: 'BDT',
    //                 tran_id: uid,
    //                 success_url: `${process.env.BACKEND_URL}/api/subscription/sslcommerz/success?session_id=${uid}`,
    //                 fail_url: `${process.env.FRONTEND_URL}/api/subscription/sslcommerz/cancel`,
    //                 cancel_url: `${process.env.FRONTEND_URL}/api/subscription/sslcommerz/cancel`,
    //                 shipping_method: 'No',
    //                 product_name: productName,
    //                 product_category: 'Subscription',
    //                 product_profile: 'general',
    //                 cus_name: user.name,
    //                 cus_email: user.email,
    //                 cus_add1: customerAddress,
    //                 cus_city: user.city || 'N/A',
    //                 cus_state: user.state || 'N/A',
    //                 cus_postcode: user.postcode || 'N/A',
    //                 cus_country: user.country || 'Bangladesh',
    //                 cus_phone: user.phone || 'N/A',
    //             };

    //  const apiResponse = await sslcz.init(data);
}