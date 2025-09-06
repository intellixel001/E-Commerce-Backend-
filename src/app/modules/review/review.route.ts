import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { ReviewPackageValidations } from './review.validation';
import { ReviewController } from './review.controller';
const router = Router();
router.post(
    '/',
    auth('user'),
    validate(ReviewPackageValidations.postReviewValidationSchema),
    ReviewController.postReview,
);
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('review_view'),
    ReviewController.getReviewByAdmin,
);
router.patch(
    '/',
    auth('admin', 'employee'),
    employeePermission('review_edit'),
    validate(ReviewPackageValidations.updateReviewValidationSchema),
    ReviewController.updateReviewByAdmin,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('review_delete'),
    ReviewController.deleteReviewByAdmin,
);
export const reviewRoutes: Router = router;
