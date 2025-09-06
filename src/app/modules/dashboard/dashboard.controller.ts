import { catchAsync } from '../../utils/catchAsync';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { DashboardService } from './dashboard.service';

export class DashboardController {
    static getDashboard = catchAsync(async (req, res) => {
        let data = await DashboardService.findDashboard();
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Get dashboard successfully',
            data,
        });
    });
}
