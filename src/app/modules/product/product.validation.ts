import { z } from 'zod';
import { languageEnum } from '../../utils/constants';
import { Types } from 'mongoose';

const postProductValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                invalid_type_error: 'Name must be a string',
                required_error: 'Name is required',
            })
            .max(255, {
                message: 'Name must be less than 255 characters long',
            }),
        description: z.record(
            languageEnum,
            z
                .string({
                    invalid_type_error: 'description be a string',
                    required_error: 'Description is required',
                })
                .max(10000, {
                    message:
                        'Description must be less than 10000 characters long',
                }),
        ),
        additional_info: z
            .record(
                z.string({
                    invalid_type_error: 'additional_info key must be string',
                    required_error: 'Description is required',
                }),
                z.any(),
            )
            .optional(),
        specifications:z.array(z.object({
            key: z.string({
                required_error:"key is required",
                invalid_type_error:"key must be string"
            }),
            values:z.array(z.string({
                required_error:"value is required",
                invalid_type_error:"value must be string"
            })).nonempty({
                message:"At least one value is required"
            })
        }), {
            invalid_type_error:"Specifications must be an array"
        }),    
        thumb_image: z.string({
            invalid_type_error: 'Thumb image must be a string',
            required_error: 'Thumb is required',
        }),
        banner_image: z.string({
            invalid_type_error: 'Banner image must be a string',
            required_error: 'Banner image is required',
        }),
        images: z
            .array(
                z.string({
                    invalid_type_error: 'images be a string',
                    required_error: 'Image is required',
                }),
                {
                    message: 'Images must be array',
                },
            )
            .optional(),
        quantity: z
            .number({
                required_error: 'quantity must be a number',
                invalid_type_error: 'quantity is required',
            })
            .nonnegative({
                message: 'Quantity must be a positive integer',
            }),
        price: z.object(
            {
                amount: z.number({
                    invalid_type_error: 'price amount must be a number',
                    required_error: 'Price is required',
                }),
                discount: z
                    .number({
                        invalid_type_error: 'Discount amount must be a number',
                        required_error: 'Discount is required',
                    })
                    .nonnegative({
                        message: 'Discount amount is required',
                    })
                    .optional()
                    .default(0),
                discount_type: z
                    .enum(['flat', 'percent'], {
                        message: 'Discount type must be flat or percent',
                    })
                    .optional()
                    .default('flat'),
            },
            {
                message: 'Price must be object',
            },
        ),
        section: z
            .array(
                z.enum(['latest', 'featured'], {
                    message: 'Section should be latest featured',
                }),
                {
                    message: 'Section must be array',
                },
            )
            .optional(),
        category: z.string({
            invalid_type_error: 'category id must be string',
            required_error: 'category id is required',
        }),
        sub_category: z.string({
            invalid_type_error: 'sub_category id must be string',
            required_error: 'sub_category id is required',
        }),
    }).strict(),
});
const updateProductValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                invalid_type_error: 'Name must be a string',
                required_error: 'Name is required',
            })
            .max(255, {
                message: 'Name must be less than 255 characters long',
            })
            .optional(),
        description: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'description be a string',
                        required_error: 'Description is required',
                    })
                    .max(10000, {
                        message:
                            'Description must be less than 10000 characters long',
                    }),
            )
            .optional(),
        additional_info: z
            .record(
                z.string({
                    invalid_type_error: 'additional_info key must be string',
                    required_error: 'Description is required',
                }),
                z.any(),
            )
            .optional(),
        specifications:z.array(z.object({
            key: z.string({
                required_error:"key is required",
                invalid_type_error:"key must be string"
            }),
            values:z.array(z.string({
                required_error:"value is required",
                invalid_type_error:"value must be string"
            })).nonempty({
                message:"At least one value is required"
            })
        }), {
            invalid_type_error:"Specifications must be an array"
        }).optional(),    
        images: z
            .array(
                z.string({
                    invalid_type_error: 'images be a string',
                    required_error: 'Image is required',
                }),
                {
                    message: 'Images must be array',
                },
            )
            .optional(),
        thumb_image: z
            .string({
                invalid_type_error: 'Thumb image must be a string',
                required_error: 'Thumb is required',
            })
            .optional(),
        banner_image: z
            .string({
                invalid_type_error: 'Banner image must be a string',
                required_error: 'Banner image is required',
            })
            .optional(),
        quantity: z
            .number({
                required_error: 'quantity must be a number',
                invalid_type_error: 'quantity is required',
            })
            .nonnegative({
                message: 'Quantity must be a positive integer',
            })
            .optional(),
        price: z
            .object(
                {
                    amount: z
                        .number({
                            invalid_type_error: 'price amount must be a number',
                            required_error: 'Price is required',
                        })
                        .nonnegative({
                            message: 'Amount amount is nonnegative',
                        }),
                    discount: z
                        .number({
                            invalid_type_error:
                                'Discount amount must be a number',
                            required_error: 'Discount is required',
                        })
                        .nonnegative({
                            message: 'Discount amount is required',
                        })
                        .optional()
                        .default(0),
                    discount_type: z
                        .enum(['flat', 'percent'], {
                            message: 'Discount type must be flat or percent',
                        })
                        .optional()
                        .default('flat'),
                },
                {
                    message: 'Price must be object',
                },
            )
            .optional(),

        section: z
            .array(
                z.enum(['latest', 'featured'], {
                    message: 'Section should be latest featured',
                }),
                {
                    message: 'Section must be array',
                },
            )
            .optional(),
        status: z
            .boolean({
                invalid_type_error: 'status must be boolean',
                required_error: 'status is required',
            })
            .optional(),
        category: z
            .string({
                invalid_type_error: 'category id must be string',
                required_error: 'category id is required',
            })
            .optional(),
        sub_category: z
            .string({
                invalid_type_error: 'sub_category id must be string',
                required_error: 'sub_category id is required',
            })
            .optional(),
    }),
});
const postProductPaymentSchema = z.object({
    body: z.object({
        method: z.enum(["sslcommerz" , "cash"], {
            message: 'Payment method should be sslcommerz , cash',
        }),
        billing_info:z.object({
            name: z
            .string({
                 invalid_type_error: 'name must be string',
                required_error: 'name is required',
            }),
            email:
            z.string({
                 invalid_type_error: 'email must be string',
                required_error: 'email is required',
            })
            .email({
                message:"email must be valid email address"
            }),
            phone:z.string({
                 invalid_type_error: 'phone must be string',
                required_error: 'phone is required',
            }),
        
            district:z.string({
                 invalid_type_error: 'district must be string',
                required_error: 'district is required',
            })
            .optional(),
            city:z.string({
                 invalid_type_error: 'city must be string',
                required_error: 'city is required',
            })
            .optional(),
            postal_code:z.string({
                 invalid_type_error: 'postal code must be string',
                required_error: 'postal code is required',
            })
            .optional(),
            house_no:z.string({
                 invalid_type_error: 'house_no must be string',
                required_error: 'house_no is required',
            })
            .optional(),
            apartment:z.string({
                 invalid_type_error: 'apartment must be string',
                required_error: 'apartment is required',
            })
            .optional(),
        })
    }).strict(),
});
const updateProductOrderSchema = z.object({
    body: z.object({
        _id: z
            .string({
                invalid_type_error: 'ID must be a string',
                required_error: 'Id is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: 'Product id is invalid',
            }),
        status: z.enum(['accepted', 'cancelled' ,"completed"], {
            message: 'status must be accepted or cancelled or completed',
        }).optional(),
        payment_status:z.enum(['paid'], {
            message: 'payment_status should be paid',
        }).optional()
    }).strict(),
});
export const ProductValidations = {
    postProductValidationSchema,
    updateProductValidationSchema,
    postProductPaymentSchema,
    updateProductOrderSchema,
};
