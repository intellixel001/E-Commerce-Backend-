import { ObjectId } from 'mongodb';
import { HttpStatusCode } from 'axios';
import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import sendResponse from '../../utils/sendResponse';
import { ProductService } from './product.service';
import { deleteFiles } from '../file/file.utils';
import mongoose, { Types } from 'mongoose';
import { getUserCartCalculation, getUserCartProducts } from '../cart/cart.utils';
import { PaymentService } from '../payment/payment.service';
import { 
    executeSslcommerzPayment,
    generateTransactionId
} from '../payment/payment.utils';
import { OrderService } from '../order/order.service';
import { generateOrderID } from '../order/order.utils';
import { TUser } from '../user/user.interface';
import { CartService } from '../cart/cart.service';

export class ProductController {
    static postProducts = catchAsync(async (req, res) => {
        const { body } = req.body;
        const exist = await ProductService.findProductByQuery({
                name: body.name 
            },
            false,
        );
        if (exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'This product already exists. Please check your existing product.',
            );
        }
        if (
            body.price.discount_type == 'flat' &&
            body.price.amount < body.price.discount
        ) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'This product price must be greater  then discount.',
            );
        }
        if (
            body.price.discount_type == 'percent' &&
            body.price.discount > 100
        ) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'This product discount must be less than 100.',
            );
        }

        await ProductService.createProduct(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Product created successfully',
            data: undefined,
        });
    });
    static postProductsOrder = catchAsync(async (req, res) => {
        const { body } = req.body;
        const { user } = res.locals;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const cart = await getUserCartCalculation(user._id);
            const tran_id = await generateTransactionId('Tx');
            const products: Types.ObjectId[] = await getUserCartProducts(
                user._id,
            );
            
            if(!cart?.total){
                throw new AppError(
                    HttpStatusCode.BadRequest,
                    "Request Failed",
                    "Your cart is empty. Please add items to your cart before proceeding to checkout"
                )
            }
            
            let data = null;
            const payment: any = await PaymentService.createPayment(
                {
                    user: user._id,
                    payment_type: 'product',
                    method: body.method,
                    status: 'pending',
                    transaction_id: tran_id,
                    amount : cart.total,
                },
                session,
            );
            const order = await OrderService.createOrder(
                {
                    user: user._id,
                    order_id: await generateOrderID('OD'),
                    products,
                    amount: cart.total,
                    delivery_charge: cart.delivery_charge,
                    status: 'pending',
                    payment: payment._id,
                },
                session,
            );
            const payload: {
                user: TUser,
                amount: number;
                payment_type: string;
                order_id: Types.ObjectId;
                tran_id: string
            } = {
                user,
                amount: cart.total,
                payment_type: 'product',
                order_id: order._id.toString(),
                tran_id: tran_id
            };
            if (body.method == 'sslcommerz') {
                data = await executeSslcommerzPayment(payload);
            } else {
                new AppError(
                    HttpStatusCode.BadRequest,
                    'Request Failed !',
                    "Payment method doesn't exist! please try again",
                );
            }
            await session.commitTransaction();
            await CartService.deleteCartByQuery({
                user: new ObjectId(user._id),
            });
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Your payment is processing',
                data,
            });
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    });
    static getProductOrders = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        const { user } = res.locals;
        if (user.role == 'user') {
            filter['user'] = new ObjectId(user._id);
        }
        if (query.status) {
            filter['status'] = query.status;
        }

        if (query.search) {
            filter[`$or`] = [
                { order_id: { $regex: new RegExp(query.search, 'i') } },
                { name: { $regex: new RegExp(query.search, 'i') } },
            ];
        }
        if (query._id) {
            const data = await OrderService.findOrderById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Order get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
        };
        const dataList = await OrderService.findOrdersWithPagination(
            filter,
            query,
            select,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Order list get successfully',
            data: dataList,
        });
    });
    static updateProductOrders = catchAsync(async (req, res) => {
        const { body }: any = req.body;
        await OrderService.findOrderById(body._id);
        await OrderService.updateOrderIntoDB({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Order updated successfully',
            data: undefined,
        });
    });
    static getProductsByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        if (query.search) {
            filter[`name`] = { $regex: new RegExp(query.search, 'i') };
        }

        if (query._id) {
            const data = await ProductService.findProductById(query._id);
            data.product_reviews = undefined;
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Product get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
            review : 0
        };
        const dataList = await ProductService.findProductsWithPagination(
            filter,
            query,
            select,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Product list get successfully',
            data: dataList,
        });
    });
    static getProductsByPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            status: true,
            quantity:{
                $gt:0
            }
        };
        const langCode = query.langCode || 'en';
        if (query.search) {
            filter[`name.${langCode}`] = {
                $regex: new RegExp(query.search, 'i'),
            };
        }
        if (query.category) {
            filter['category'] = new ObjectId(query.category);
        }
        if (query.sub_category) {
            filter['sub_category'] = new ObjectId(query.sub_category);
        }
        if(query.section){
             filter['section'] = {
                $in:[query.section]
             }
        }
        const select = {
            __v: 0,
            status: 0,
            additional_info: 0,
            updatedAt: 0,
            description:0,
            images:0,
            section:0,
            review : 0
        };
        if (query._id) {
            const data = await ProductService.findProductById(query._id);
            const related_products =
                await ProductService.findProductsWithPagination(
                    { category: data.category._id },
                    query,
                    select,
                );
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Product get successfully',
                data: {
                    ...data,
                    final_price:
                        data.price.discount_type == 'flat'
                            ? data.price.amount - data.price.discount
                            : data.price.amount -
                              (data.price.amount * data.price.discount) / 100,
                    related_products: related_products.docs,
                },
            });
        }

        const dataList = await ProductService.findProductsWithPagination(
            filter,
            query,
            select,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Product list get successfully',
            data: dataList,
        });
    });
    static updateProducts = catchAsync(async (req, res) => {
        const { body } = req.body;
        await ProductService.findProductById(body._id);
        if (
            body?.price &&
            body?.price?.discount_type == 'flat' &&
            body?.price?.amount < body?.price?.discount
        ) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'This product price must be greater  then discount.',
            );
        }
        if (
            body?.price &&
            body?.price?.discount_type == 'percent' &&
            body?.price?.discount > 100
        ) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'This product discount must be less than 100.',
            );
        }
        await ProductService.updateProduct({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Product updated successfully',
            data: undefined,
        });
    });
    static deleteProducts = catchAsync(async (req, res) => {
        const { id } = req.params;
        const product = await ProductService.findProductById(id);
        if (product?.images) await deleteFiles(product.images);
        if (product?.thumb_image) await deleteFiles([product.thumb_image]);
        if(product?.banner_image) await deleteFiles([product.banner_image]);
        await ProductService.deleteProductById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Product deleted successfully',
            data: undefined,
        });
    });
}
