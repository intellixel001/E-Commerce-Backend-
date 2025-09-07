import { catchAsync } from '../../utils/catchAsync';
import { SettingService } from './setting.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import config from '../../config';

export class SettingController {
    static updateSettings = catchAsync(async (req, res) => {
        const { body } = req.body;

        const is_exist_cloudinary = config.cloudinary_cloud_name;
        if (!is_exist_cloudinary && body?.file_upload_type == 'cloudinary') {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'cloudinary configuration error',
                'cloudinary credentials are missing from the environment variables. Please ensure that your .env file is properly configured with the required cloudinary access keys',
            );
        }

        await SettingService.updateSetting(body);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Settings updated successfully',
            data: undefined,
        });
    });
    static getSettingsByPublic = catchAsync(async (req, res) => {
        const select = {
            _id: 1,
            site_name: 1,
            site_email: 1,
            site_phone: 1,
            site_logo: 1,
            banner_image: 1,
            otp_verification_type: 1,
            site_address: 1,
            site_description: 1,
            site_footer: 1,
            currency_code: 1,
            currency_symbol: 1,
            address: 1,
            social_media_link: 1,
            fav_icon: 1,
            gallery: 1,
            partner: 1,
            ssl_commerz: 1,
            delivery_charge: 1,
            min_product_price_free_delivery:1
        };
        const data = await SettingService.findSettingBySelect(select);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Settings get successfully',
            data: {
                ...data._doc,
                payment_methods_logo: [
                    data.ssl_commerz?.is_active && data?.ssl_commerz.logo
                        ? data.ssl_commerz.logo
                        : undefined,
                ],
                // ssl_commerz: undefined,
            },
        });
    });
    static getSettingsByAdmin = catchAsync(async (req, res) => {
        const { query } = req;
        const localFields =
            typeof query.fields === 'string'
                ? query.fields.split(',').join(' ')
                : '-updatedAt -__v';
        const data = await SettingService.findSettingBySelect(localFields);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Settings get successfully',
            data,
        });
    });
}
