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
            const {body} = req.body;
            const session = await mongoose.connection.startSession();
            session.startTransaction();
            if(body.status != "VALID"){
                throw new AppError(
                 400,
                'Request Failed !',
                 `The transaction with ID ${body.tran_id} could not be completed. Status: ${body.status}. Please verify the payment details.`,
            );
            }
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
