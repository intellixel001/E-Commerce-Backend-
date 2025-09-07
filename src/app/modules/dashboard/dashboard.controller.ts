import { catchAsync } from '../../utils/catchAsync';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { DashboardService } from './dashboard.service';

export class DashboardController {
    static getDashboard = catchAsync(async (req, res) => {
        const {user} = res.locals;
        let data = null ;
        if(user.role == "user"){
             data = await DashboardService.findDashboardByUser(user);
        }else{
             data = await DashboardService.findDashboardByAdmin();
        }
        
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Get dashboard successfully',
            data,
        });
    });
}
