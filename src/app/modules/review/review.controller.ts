import { catchAsync } from '../../utils/catchAsync';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { ReviewService } from './review.service';

export class ReviewController {
    static postReview = catchAsync(async (req, res) => {
        const { body } = req.body;
        const { user } = res.locals;
        await ReviewService.createReviewPackage({
            ...body,
            user: user._id,
        });
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message:
                'Review submitted successfully. Thank you for your feedback!',
            data: undefined,
        });
    });
    static getReviewByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            is_deleted:false
        };
        if (query.search) {
            filter['user.name'] = { $regex: new RegExp(query.search, 'i') };
        }
        if (query._id) {
            const data = await ReviewService.findReviewPackageById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Package review get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
            is_deleted:0
        };
        const dataList = await ReviewService.findReviewWithPagination(
            filter,
            query,
            select,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Package review list get successfully',
            data: dataList,
        });
    });
    static updateReviewByAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        await ReviewService.updateReviewPackage({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Review updated successfully',
            data: undefined,
        });
    });
    static deleteReviewByAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        await ReviewService.deleteReviewPackageById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Package review deleted successfully',
            data: undefined,
        });
    });
}
