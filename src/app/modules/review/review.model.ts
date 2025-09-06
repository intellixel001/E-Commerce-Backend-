import { model, Schema } from 'mongoose';

import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TReview  } from './review.interface';

const schema = new Schema<TReview>(
    {
        comment: {
            type: String,
            trim: true,
            default: undefined,
        },
        rating:{
            type: Number,
            max: [5, "Rating must not be greater than 5"],
            min: [1, "Rating must be at least 1"],
            default: 3,
        },
        status: {
            type: Boolean,
            default: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'product',
        },
        is_deleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true },
);
schema.plugin(aggregatePaginate);
const Review = model<TReview>('review', schema);
export default Review;
