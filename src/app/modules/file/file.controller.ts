import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import {
    cloudinaryUploadFile,
    cloudinaryUploadFiles,
    deleteFiles,
    localUploadFile,
    localUploadFiles,
} from './file.utils';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { SettingService } from '../setting/setting.service';

export class FileController {
    static singleImageUpload = catchAsync(async (req, res) => {
        const { files }: any = req;
        if (!files?.image) {
            throw new AppError(400, 'Invalid Request', 'Image is required');
        }
        const mimetypes = [
            'image/png',
            'image/jpeg',
            'image/webp',
            'image/jpg',
        ];
        if (!mimetypes.includes(files?.image?.mimetype)) {
            throw new AppError(
                404,
                'Invalid Request',
                'Only png jpeg webp jpg image file is acceptable',
            );
        }
        if (files?.image?.size > 5000000) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Invalid Request',
                'Image is too large. Please upload an image smaller than 5MB.',
            );
        }
        const image_name: string = 'shine';
        let image: any = null;
        const setting = await SettingService.findSettingBySelect({
            file_upload_type: 1,
        });
        if (setting.file_upload_type == 'cloudinary') {
            image = await cloudinaryUploadFile(files.image, image_name);
        } else if (setting.file_upload_type == 'local') {
            image = await localUploadFile(files.image, image_name);
        }

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: `Image uploaded successfully.`,
            data: {
                image,
            },
        });
    });
    static multipleImageUpload = catchAsync(async (req, res) => {
        const { files }: any = req;
        if (!files?.images) {
            throw new AppError(400, 'Invalid Request', 'Images are required');
        }
        if (!Array.isArray(files?.images)) {
            files.images = [files.images];
        }

        files.images.forEach((file: any) => {
            if (file.size > 5000000) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    'Invalid Request',
                    'Image is too large. Please upload an image smaller than 5MB.',
                );
            }
            if (
                !['image/jpeg', 'image/png', 'image/jpg'].includes(
                    file?.mimetype,
                )
            ) {
                throw new AppError(
                    400,
                    'Invalid Request',
                    'Only jpeg , png and jpg files are allowed for images',
                );
            }
        });

        const image_name = 'shine';
        let images: any = null;
        const setting = await SettingService.findSettingBySelect({
            file_upload_type: 1,
        });
        if (setting.file_upload_type == 'cloudinary') {
            images = await cloudinaryUploadFiles(
                files?.images || [],
                image_name,
            );
        } else if (setting.file_upload_type == 'local') {
            images = await localUploadFiles(files.images || [], image_name);
        }
        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: `Images uploaded successfully.`,
            data: {
                images,
            },
        });
    });
    static removeImage = catchAsync(async (req, res) => {
        const { body }: any = req;
        if (!body.file) {
            throw new AppError(400, 'Invalid Request', 'File are required');
        }
        await deleteFiles([body?.file]);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'File removed successfully',
            data: undefined,
        });
    });
}
