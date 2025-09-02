export class PaymentController {
    // static updateStripePaymentWithWebhook = catchAsync(
    //     async (req, res, next) => {
    //         const settings = await SettingService.findSettingBySelect({
    //             stripe: 1,
    //         });
    //         const stripe = new Stripe(
    //             settings.stripe?.credentials.stripe_secret_key as string,
    //         );
    //         const sig = req.headers['stripe-signature'] as string | string[];
    //         let event: any;
    //         try {
    //             const endpointSecret = settings.stripe?.credentials
    //                 .stripe_webhook_secret as string;
    //             event = stripe.webhooks.constructEvent(
    //                 req.body,
    //                 sig,
    //                 endpointSecret,
    //             );
    //         } catch (error) {
    //             throw new AppError(
    //                 httpStatus.BAD_REQUEST,
    //                 'Request Failed !',
    //                 'web hook provide an error',
    //             );
    //         }
    //         const session = await mongoose.connection.startSession();
    //         session.startTransaction();
    //         try {
    //             const object = event.data.object;
    //             console.log(object.metadata.booking_id);
    //             switch (event.type) {
    //                 case 'checkout.session.completed':
    //                     if (object.metadata.payment_type === 'package') {
    //                         await PackageBookingUpdate(
    //                             object.metadata.booking_id,
    //                             'completed',
    //                         );
    //                     } else if (object.metadata.payment_type === 'hotel') {
    //                         await HotelBookingUpdate(
    //                             object.metadata.booking_id,
    //                             'completed',
    //                         );
    //                     } else if (object.metadata.payment_type === 'product') {
    //                         await ProductOrderUpdate(
    //                             object.metadata.booking_id,
    //                             'completed',
    //                         );
    //                     }
    //                     break;
    //                 case 'checkout.session.expired':
    //                     if (object.metadata.payment_type === 'package') {
    //                         await PackageBookingUpdate(
    //                             object.metadata.booking_id,
    //                             'expired',
    //                         );
    //                     } else if (object.metadata.payment_type === 'hotel') {
    //                         await HotelBookingUpdate(
    //                             object.metadata.booking_id,
    //                             'expired',
    //                         );
    //                     } else if (object.metadata.payment_type === 'product') {
    //                         await ProductOrderUpdate(
    //                             object.metadata.booking_id,
    //                             'expired',
    //                         );
    //                     }
    //                     break;
    //                 case 'checkout.session.async_payment_failed':
    //                     if (object.metadata.payment_type === 'package') {
    //                         await PackageBookingUpdate(
    //                             object.metadata.booking_id,
    //                             'failed',
    //                         );
    //                     } else if (object.metadata.payment_type === 'hotel') {
    //                         await HotelBookingUpdate(
    //                             object.metadata.booking_id,
    //                             'failed',
    //                         );
    //                     } else if (object.metadata.payment_type === 'product') {
    //                         await ProductOrderUpdate(
    //                             object.metadata.booking_id,
    //                             'failed',
    //                         );
    //                     }
    //                     break;
    //                 default:
    //                     console.log(`Unhandled event type ${event.type}`);
    //             }
    //             await session.commitTransaction();
    //             sendResponse(res, {
    //                 statusCode: httpStatus.OK,
    //                 success: true,
    //                 message: 'Payment completed successfully',
    //                 data: undefined,
    //             });
    //         } catch (error) {
    //             console.log(error);
    //             await session.abortTransaction();
    //             next(error);
    //         } finally {
    //             await session.endSession();
    //         }
    //     },
    // );
}
