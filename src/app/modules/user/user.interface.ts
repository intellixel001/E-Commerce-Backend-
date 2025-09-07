import { Types } from 'mongoose';
export type TUser = {
    _id?: Types.ObjectId
    name: string;
    email?: string | undefined | null;
    phone?: string | undefined | null;
    password: string;
    image?: string;
    role: string;
    country?: string;
    city?: string;
    state?: string;
    zip_code: number;
    address?: string;
    about?: string;
    permissions?: Types.ObjectId;
    fcm_token: string[];
    push_notification_status: boolean;
    is_deleted: boolean;
    isModified: (field: string) => boolean;
};

export type TUserExist = {
    _id: Types.ObjectId | undefined;
    email: string | undefined;
    phone: string | undefined;
};
