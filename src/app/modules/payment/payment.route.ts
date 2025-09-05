import { Router } from 'express';
import { PaymentController } from './payment.controller';

const router = Router();

router.post(
    '/sslcommerz',
     PaymentController.updateSslcommerzPayment
);

export const paymentRoutes: Router = router;
