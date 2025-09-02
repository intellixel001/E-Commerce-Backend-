import { generateRandomNumber } from '../../utils/helpers';
import { OrderService } from './order.service';

import { PaymentService } from '../payment/payment.service';
import Order from './order.model';

import { ProductService } from '../product/product.service';
import User from '../user/user.model';
import { UserService } from '../user/user.service';
import dayjs from 'dayjs';

export const generateOrderID = async (prefix: string): Promise<any> => {
    const randomString =
        prefix + String.fromCharCode(...generateRandomNumber(7, 32)).toString();
    const exists = await Order.findOne({
        orderId: randomString,
    });
    if (exists) {
        console.error('Matched!', randomString);
        return await generateOrderID(prefix);
    }
    return randomString;
};
const updateProductQuantityBYProducts = async (products: any): Promise<any> => {
    products.forEach((item: any) => {
        ProductService.updateProduct(
            { _id: item.product },
            { $inc: { quantity: -item.quantity } },
        );
    });
};
