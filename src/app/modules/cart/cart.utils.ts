import { Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import { SettingService } from '../setting/setting.service';
import { CartService } from './cart.service';
import Order from '../order/order.model';

export const getUserCartCalculation = async (uid: Types.ObjectId) => {
    const filter = {
        user: new ObjectId(uid),
    };
    const setting = await SettingService.findSettingBySelect({
        delivery_charge: 1,
    });
    const order = await Order.findOne({
          user: new ObjectId(uid),
          status:{
             $in:['completed', 'accepted']
          }
    });
    const cart = await CartService.findCartCalculate(filter);
    const total =  (order ?  setting.delivery_charge : 0) + (cart ? cart.total_price : 0);
    return {
        total,
        delivery_charge : order ? setting.delivery_charge : 0,
        sub_total: cart ? cart.total_price : 0,
    }
};
export const getUserCartProducts = async (uid: Types.ObjectId) => {
    const filter = {
        user: new ObjectId(uid),
    };
    const select = {
        updatedAt: 0,
        __v: 0,
    };
    const dataList = await CartService.findCartWithPagination(
        filter,
        {},
        select,
    );
    const products: any = [];
    dataList.docs.forEach((item: any) => {
        products.push({
            product: new ObjectId(item.product._id),
            quantity: item.quantity,
        });
    });
    return products;
};
