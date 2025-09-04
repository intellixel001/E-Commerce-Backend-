import { z } from 'zod';

const postSettingValidationSchema = z.object({
    body: z
        .object({
            site_name: z
                .string({
                    invalid_type_error: 'site_name name must be string',
                    required_error: 'site_name name is required',
                })
                .optional(),
            site_email: z
                .string({
                    invalid_type_error: 'Email must be string',
                    required_error: 'Email is required',
                })
                .email({
                    message: 'Invalid email address',
                })
                .optional(),
            site_phone: z
                .string({
                    invalid_type_error: 'phone number must be string',
                    required_error: 'phone number is required',
                })
                .optional(),
            site_logo: z
                .string({
                    invalid_type_error: 'logo must be string',
                    required_error: 'logo is required',
                })
                .optional(),
            fav_icon: z
                .string({
                    invalid_type_error: 'fav_icon must be string',
                    required_error: 'fav_icon is required',
                })
                .optional(),
            site_address: z
                .string({
                    invalid_type_error: 'address must be string',
                    required_error: 'address is required',
                })
                .optional(),
            site_description: z
                .string({
                    invalid_type_error: 'description must be string',
                    required_error: 'description is required',
                })
                .optional(),
            site_footer: z
                .string({
                    invalid_type_error: 'footer must be string',
                    required_error: 'footer is required',
                })
                .optional(),
            currency_code: z
                .string({
                    invalid_type_error: 'currency_code must be string',
                    required_error: 'currency_code is required',
                })
                .optional(),
            currency_symbol: z
                .string({
                    invalid_type_error: 'currency_symbol must be string',
                    required_error: 'currency_symbol is required',
                })
                .optional(),
            client_side_url: z
                .string({
                    invalid_type_error: 'client_side_url must be string',
                    required_error: 'client_side_url is required',
                })
                .url({
                    message: 'URL must be string',
                })
                .optional(),
            server_side_url: z
                .string({
                    invalid_type_error: 'client_side_url must be string',
                    required_error: 'client_side_url is required',
                })
                .url({
                    message: 'URL must be a string',
                })
                .optional(),
            banner_image: z
                .string({
                    invalid_type_error: 'banner_image must be string',
                    required_error: 'banner_image is required',
                })
                .optional(),
            otp_verification_type: z
                .enum(['email', 'phone'], {
                    message: 'otp_verification_type must be email or phone',
                })
                .optional(),
            delivery_charge: z
                .number({
                    invalid_type_error: 'delivery_charge must be number',
                    required_error: 'delivery_charge is required',
                })
                .nonnegative({
                    message:
                        'delivery_charge must be greater than or equal to 0',
                })
                .optional(),
            email_config: z
                .object(
                    {
                        default: z
                            .enum(['gmail', 'sendgrid'], {
                                message: 'default must be gmail or sendgrid',
                            })
                            .optional(),
                        sendgrid: z
                            .object(
                                {
                                    host: z
                                        .string({
                                            invalid_type_error:
                                                'host must be string',
                                            required_error: 'host is required',
                                        })
                                        .optional(),
                                    port: z
                                        .number({
                                            invalid_type_error:
                                                'port must be number',
                                            required_error: 'port is required',
                                        })
                                        .optional(),
                                    username: z
                                        .string({
                                            invalid_type_error:
                                                'username must be string',
                                            required_error:
                                                'username is required',
                                        })
                                        .optional(),
                                    password: z
                                        .string({
                                            invalid_type_error:
                                                'password must be string',
                                            required_error:
                                                'password is required',
                                        })
                                        .optional(),
                                    sender_email: z
                                        .string({
                                            invalid_type_error:
                                                'sender_email must be string',
                                            required_error:
                                                'sender_email is required',
                                        })
                                        .optional(),
                                },
                                {
                                    message: 'sendgrid must be object',
                                },
                            )
                            .optional(),
                        gmail: z
                            .object(
                                {
                                    auth_email: z
                                        .string({
                                            invalid_type_error:
                                                'email must be string',
                                            required_error: 'email is required',
                                        })
                                        .optional(),
                                    password: z
                                        .string({
                                            invalid_type_error:
                                                'password must be string',
                                            required_error:
                                                'password is required',
                                        })
                                        .optional(),
                                    service_provider: z
                                        .string({
                                            invalid_type_error:
                                                'service_provider must be string',
                                            required_error:
                                                'service_provider is required',
                                        })
                                        .optional(),
                                },
                                {
                                    message: 'sendgrid must be object',
                                },
                            )
                            .optional(),
                    },
                    {
                        message: 'email_config must be object',
                    },
                )
                .optional(),
            phone_config: z
                .object(
                    {
                        twilio_auth_token: z
                            .string({
                                invalid_type_error:
                                    'twilio_auth_token must be string',
                                required_error: 'twilio_auth_token is required',
                            })
                            .optional(),
                        twilio_sender_number: z
                            .string({
                                invalid_type_error:
                                    'twilio_sender_number must be string',
                                required_error:
                                    'twilio_sender_number is required',
                            })
                            .optional(),
                        twilio_account_sid: z
                            .string({
                                invalid_type_error:
                                    'twilio_account_sid must be string',
                                required_error:
                                    'twilio_account_sid is required',
                            })
                            .optional(),
                        is_active: z
                            .boolean({
                                invalid_type_error: 'active must be boolean',
                                required_error: 'active is required',
                            })
                            .optional(),
                    },
                    {
                        message: 'sms must be object',
                    },
                )
                .optional(),
            //payment method -->
            ssl_commerz: z
                .object({
                    credentials: z.object({
                        client_id: z
                            .string({
                                invalid_type_error: 'client_id  must be string',
                                required_error: 'client_id is required',
                            })
                            .optional(),
                        client_secret: z
                            .string({
                                invalid_type_error:
                                    'client_secret must be string',
                                required_error: 'client_secret is required',
                            })
                            .optional(),
                        is_live:z.boolean({
                            invalid_type_error:'is_live must be boolean',
                            required_error:'is_live is required',
                        }).optional()    
                    }),
                    is_active: z
                        .boolean({
                            invalid_type_error:
                                'ssl_commerz is active must be boolean',
                            required_error:
                                'ssl_commerz is active must be boolean',
                        })
                        .optional(),
                    logo: z
                        .string({
                            invalid_type_error:
                                'ssl_commerz logo must be string',
                            required_error: 'ssl_commerz logo is required',
                        })
                        .optional(),
                    name: z.string({
                        invalid_type_error: 'ssl_commerz must be string',
                        required_error: 'ssl_commerz name is required',
                    }),
                })
                .optional(),
            social_media_link: z
                .array(
                    z.object({
                        name: z.string({
                            invalid_type_error:
                                'social_media_link name must be a string',
                            required_error:
                                'social_media_link name is required',
                        }),
                        link: z.string({
                            invalid_type_error:
                                'social_media_link link must be a string',
                            required_error:
                                'social_media_link link is required',
                        }),
                    }),
                    {
                        message:
                            'social_media_link must be an array of objects',
                    },
                )
                .optional(),
            gallery: z
                .array(
                    z.string({
                        invalid_type_error: 'gallery must be a string',
                        required_error: 'gallery is required',
                    }),
                    {
                        message: 'gallery url must be array',
                    },
                )
                .optional(),
        })
        .strict(),
});

export const SettingValidations = {
    postSettingValidationSchema,
};
