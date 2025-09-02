import { Types } from 'mongoose';
export interface TProduct {
    name: string;
    description: Map<string, string>;
    additional_info?: Map<string, any>;
    images?: [string];
    thumb_image?: string;
    banner_image?: string;
    quantity: number;
    price?: {
        amount: number;
        discount?: number;
        discount_type?: string;
    };
    section: [];
    status: boolean;
    category: Types.ObjectId;
    sub_category: Types.ObjectId;
}
