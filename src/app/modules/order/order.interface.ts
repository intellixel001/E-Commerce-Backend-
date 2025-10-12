import { Types } from 'mongoose';

export type TBillingInfo = {
        name: string;
        email:string;
        phone:string;
        district:string;
        city:string;
        postal_code:string;
        house_no:string;
        apartment:string;
    
}
export type TOrder = {
    order_id: string;
    products: {
        product: Types.ObjectId;
        quantity: number;
    }[];
    amount: number;
    status: 'pending' | 'completed' | 'accepted' | 'cancelled';
    delivery_charge: number;
    payment: Types.ObjectId;
    user: Types.ObjectId;
    billing_info: TBillingInfo
};
