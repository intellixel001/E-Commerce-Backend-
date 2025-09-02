import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import { Types } from 'mongoose';
import ProjectCategory from './product-category.model';
import ProductCategory from './product-category.model';
import { TUser } from '../user/user.interface';
export class ProductCategoryService {
    static async postProductCategoryByPayload(payload: any) {
        const data = await ProductCategory.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Can not create new product category ! please check your credentials and try again',
            );
        }
        return data;
    }
    static async findProductCategoryById(_id: string | Types.ObjectId) {
        const data = await ProductCategory.findById(_id).select(
            '-updatedAt -__v -is_deleted',
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Product category not found. Please check project category Id and try again',
            );
        }
        return data;
    }
    static async findProductCategoryByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await ProductCategory.findOne(query).select(
            '-updatedAt -__v -is_deleted',
        );
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Product category not found !',
            );
        }
        return data;
    }
    static async findProductCategoryListByQuery(
        user: TUser,
        filter: any,
        query: Record<string, string | boolean | number>,
    ) {
        const restrict: any = {
            is_deleted: false,
        };
        if (user?.role != 'admin') {
            restrict['status'] = true;
        }
        const aggregate = ProductCategory.aggregate([
            {
                $match: {
                    parent: null,
                    ...filter,
                },
            },
            {
                $graphLookup: {
                    from: 'product_categories',
                    startWith: '$_id',
                    connectFromField: '_id',
                    connectToField: 'parent',
                    maxDepth: 10, // Imposta un limite di profondità adeguato
                    depthField: 'depth',
                    restrictSearchWithMatch: restrict,
                    as: 'children',
                },
            },
            {
                $project: {
                    is_deleted: 0,
                    parent: 0,
                    __v: 0,
                    updatedAt: 0,
                },
            },
        ]);
        const options = {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
        };
        return await ProductCategory.aggregatePaginate(aggregate, options);
    }

    static async findProductMainCategoryListFromDB() {
        const filter: any = {
            is_deleted: false,
            status: true,
            parent: null,
        };
        const aggregate = await ProductCategory.aggregate([
            {
                $match: filter,
            },
            {
                $project: {
                    name: 1,
                    image:1,
                },
            },
        ]);
        return aggregate;
    }
    static async updateProductCategoryByQuery(
        query: Record<string, string | boolean | number>,
        updatedDocument: Record<string, string | boolean | number>,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const data = await ProductCategory.findOneAndUpdate(
            query,
            updatedDocument,
            options,
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Can not updated  product category ! please try again',
            );
        }
        return data;
    }
    static async deleteProductCategoryById(_id: string | Types.ObjectId) {
        const data = await ProjectCategory.findByIdAndUpdate(_id, {
            is_deleted: true,
        }).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Product category not found ! please check product category Id and try again',
            );
        }
        return data;
    }
}
