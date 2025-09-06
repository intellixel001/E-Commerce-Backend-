import { Router } from 'express';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { DashboardController } from './dashboard.controller';

const router = Router();

router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('dashboard_view'),
    DashboardController.getDashboard,
);

export const dashboardRoutes: Router = router;
