import { Router } from 'express';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { SettingPageController } from './setting-page.controller';
import validate from '../../middleware/validate';
import { SettingPageValidations } from './setting-page.validation';
const router = Router();
router.patch(
    '/',
    auth('admin', 'employee'),
    employeePermission('setting_edit'),
    validate(SettingPageValidations.pageSettingValidationSchema),
    SettingPageController.updatePageBYAdmin,
);
router.get('/site', SettingPageController.getPageListByPublic);

export const pageRoutes: Router = router;
