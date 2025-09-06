import { Types } from 'mongoose';

export type TReview = {
    comment?: string ;
    rating : number;
    status: boolean;
    user: Types.ObjectId;
    product:Types.ObjectId;
    is_deleted: boolean
};
