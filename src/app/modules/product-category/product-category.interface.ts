import { Types } from 'mongoose';

export type TProductCategory = {
    parent: Types.ObjectId;
    name: Map<string, string>;
    description: Map<string, string>;
    image: string;
    status: boolean;
    is_deleted: boolean;
};
