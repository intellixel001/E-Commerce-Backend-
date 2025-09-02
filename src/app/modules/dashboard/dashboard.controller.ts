import { catchAsync } from '../../utils/catchAsync';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';

export class DashboardController {
    static getDashboard = catchAsync(async (req, res) => {
        const { user } = res.locals;
        let data = null;
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Get dashboard successfully',
            data,
        });
    });
    static getAllFilter = catchAsync(async (req, res) => {
        const data = null;
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Get Filtered data successfully',
            data,
        });
    });
}
