import { Router } from 'express';
import { SettingController } from './setting.controller';
import validate from '../../middleware/validate';
import { SettingValidations } from './setting.validation';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';

const router = Router();

router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('setting_create'),
    validate(SettingValidations.postSettingValidationSchema),
    SettingController.updateSettings,
);

router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('setting_view'),
    SettingController.getSettingsByAdmin,
);

router.get('/site', SettingController.getSettingsByPublic);

export const settingRoutes: Router = router;
