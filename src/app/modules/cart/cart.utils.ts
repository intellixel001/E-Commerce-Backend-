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
        min_product_price_free_delivery:1
    });
   const order = await Order.findOne({
          user: new ObjectId(uid),
          status:{
             $in:['completed', 'accepted']
          }
 });
    const cart = await CartService.findCartCalculate(filter);
    const delivery_charge =  !order &&  cart.total_price  > setting.min_product_price_free_delivery 
                     ?   0 : setting.delivery_charge;
    return {
        total : cart ? (cart.total_price + delivery_charge) : 0,
        delivery_charge,
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
