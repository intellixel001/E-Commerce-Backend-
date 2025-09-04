export type TSetting = {
    site_name?: string;
    site_email?: string;
    site_phone?: string;
    site_logo?: string;
    fav_icon: string;
    site_address?: string;
    site_description?: string;
    site_footer?: string;
    currency_code?: string;
    currency_symbol?: string;
    client_side_url?: string;
    server_side_url?: string;
    banner_image?: string;
    otp_verification_type?: 'email' | 'phone';
    file_upload_type: 'local' | 'cloudinary';
    delivery_charge: number;
    email_config: {
        default: string;
        sendgrid: {
            host: string;
            port: number;
            username: string;
            password: string;
            sender_email: string;
        };
        gmail: {
            auth_email: string;
            password: string;
            service_provider: string;
        };
    };
    ssl_commerz: {
        credentials: {
            client_id: string;
            client_secret: string;
            is_live: boolean,

        };
        is_active: boolean;
        logo: string;
        name: string;
    };
    social_media_link: {
        name: string;
        link: string;
    }[];
    phone_config: {
        twilio_auth_token: string;
        twilio_sender_number: string;
        twilio_account_sid: string;
        is_active: boolean;
    };
    gallery: string[];
    partner: string[];
};
