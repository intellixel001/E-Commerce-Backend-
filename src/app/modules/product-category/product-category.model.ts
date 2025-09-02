import { TProductCategory } from './product-category.interface';
import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new Schema<TProductCategory>(
    {
        parent: {
            type: Schema.Types.ObjectId,
            ref: 'product_category',
            default: null,
        },
        name: {
            type: Schema.Types.Map,
            index: true,
            of: String,
        },
        description: {
            type: Schema.Types.Map,
            of: String,
        },
        image: String,
        status: {
            type: Boolean,
            default: true,
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

schema.plugin(aggregatePaginate);

const ProductCategory = model<TProductCategory, any>(
    'product_category',
    schema,
);

export default ProductCategory;
