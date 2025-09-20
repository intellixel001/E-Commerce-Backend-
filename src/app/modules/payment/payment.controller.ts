import { HttpStatusCode } from "axios";
import sendResponse from "../../utils/sendResponse";
import mongoose from "mongoose";
import { SettingService } from "../setting/setting.service";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentService } from "./payment.service";
import AppError from "../../errors/AppError";
import { OrderService } from "../order/order.service";

export class PaymentController {
    static updateSslcommerzPayment = catchAsync(async (req, res, next) => {
         const setting = await SettingService.findSettingBySelect({client_side_url:1})
            const body = req?.body.body || req?.body ||  req.query ;
            const session = await mongoose.connection.startSession();
            session.startTransaction();
            const payment = await PaymentService.findPaymentByQuery({
                transaction_id :body.tran_id,
            })
            try{
              if(payment.status  == "pending"){
                 await PaymentService.updatePayment(
                   {_id: payment._id },
                   {status :"paid"},
                    session
                 )
                await OrderService.updateOrder(
                    { payment: payment._id },
                    {status :"accepted"},
                    session
                )
              }
              
            await session.commitTransaction();
            res.redirect(`${setting.client_side_url}/sslcommerz/success?tran_id=${body.tran_id}&amount=${body.amount}`);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Payment completed successfully',
                data: undefined,
            });
            } catch (error) {
                console.log(error);
                await session.abortTransaction();
                next(error);
            } finally {
                await session.endSession();
            }
        },
    );
}
