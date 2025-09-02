import { generateID } from '../../utils/helpers';
import cloudinary from 'cloudinary';
import config from '../../config';
import path, { resolve } from 'node:path';
import * as fs from 'node:fs';
import { SettingService } from '../setting/setting.service';
export const cloudinaryUploadFile = async (file: any, folder: string) => {
    return new Promise((resolve, reject) => {
        cloudinary.v2.config({
            cloud_name: config.cloudinary_cloud_name,
            api_key: config.cloudinary_api_key,
            api_secret: config.cloudinary_api_secret,
        });

        const options = {
            folder,
            use_filename: true,
            unique_filename: true,
        };

        const stream = cloudinary.v2.uploader.upload_stream(
            options,
            (error, result) => {
                if (error) return reject(error);
                resolve(result?.secure_url || '');
            },
        );

        stream.end(file.data);
    });
};
export const cloudinaryUploadFiles = async (files: any[], folder: string) => {
    if (!files || files.length === 0) return Promise.resolve([]);
    const uploadPromises = files.map((file) =>
        cloudinaryUploadFile(file, folder),
    );
    return Promise.all(uploadPromises);
};
export const cloudinaryRemoveFiles = async (files: any) => {
    cloudinary.v2.config({
        cloud_name: config.cloudinary_cloud_name,
        api_key: config.cloudinary_api_key,
        api_secret: config.cloudinary_api_secret,
    });
    const public_ids = files.map((url: string) => {
        const baseUrl = path.basename(url);
        const public_id = 'shine/' + path.parse(baseUrl).name;
        return public_id;
    });
    const result = await cloudinary.v2.api.delete_resources(public_ids);
    return result;
};
export const localUploadFile = async (file: any, folder: string) => {
    if (!file) return Promise.resolve('');
    // eslint-disable-next-line no-undef
    const uploadDir = path.join(__dirname, '../../../../', 'public', folder);
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    const setting = await SettingService.findSettingBySelect({
        server_side_url: 1,
    });
    const filename =
        file.name
            .replace(path.extname(file.name), '')
            .toLowerCase()
            .split(' ')
            .join('-') +
        '-' +
        Date.now() +
        path.extname(file.name);
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, file.data);
    return Promise.resolve(
        setting.server_side_url +
            '/' +
            filePath.substring(filePath.indexOf('public')),
    );
};
export const localUploadFiles = async (files: any, folder: string) => {
    if (files.length === 0) return Promise.resolve([]);
    // eslint-disable-next-line no-undef
    const uploadDir = path.join(__dirname, '../../../../', 'public', folder);
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    const setting = await SettingService.findSettingBySelect({
        server_side_url: 1,
    });
    const params = files.map((file: any) => {
        const filename =
            file.name
                .replace(path.extname(file.name), '')
                .toLowerCase()
                .split(' ')
                .join('-') +
            '-' +
            Date.now() +
            path.extname(file.name);
        return {
            uploadDir: path.join(uploadDir, filename),
            body: file.data,
        };
    });
    return await Promise.all(
        params.map(async (param: any) => {
            fs.writeFileSync(param.uploadDir, param.body);
            return (
                setting.server_side_url +
                '/' +
                param.uploadDir.substring(param.uploadDir.indexOf('public'))
            );
        }),
    );
};
export const localDeleteFiles = async (files: any) => {
    if (files.length === 0) return Promise.resolve([]);
    // eslint-disable-next-line no-undef
    const removeDir = path.join(__dirname, '../../../../');
    files.map((file: any) => {
        const removeFile =
            removeDir + '/' + file.substring(file.indexOf('public'));
        if (fs.existsSync(removeFile)) {
            fs.unlinkSync(removeFile);
        }
    });
    return await Promise.all(files);
};
export const deleteFiles = async (files: any) => {
    const setting = await SettingService.findSettingBySelect({
        file_upload_type: 1,
    });
    if (setting.file_upload_type == 'cloudinary') {
        await cloudinaryRemoveFiles(files);
    } else if (setting.file_upload_type == 'local') {
        await localDeleteFiles(files);
    }
};
