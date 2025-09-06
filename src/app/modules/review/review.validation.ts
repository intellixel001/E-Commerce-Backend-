import z from 'zod';
import { Types } from 'mongoose';
import { ObjectId } from 'mongodb';
const postReviewValidationSchema = z.object({
    body: z.object({
        rating: z
            .number({
                invalid_type_error: 'rating must be number',
                required_error: 'rating is required',
            })
            .gte(1, {
                message: 'Rating must be greater than 0',
            })
            .lte(5, {
                message: 'Rating must be less than or equal to 5',
            })
            .default(3),
        comment: z
            .string({
                invalid_type_error: 'comment must be string',
                required_error: 'comment is required',
            })
            .max(255, {
                message: 'comment length must be less  than 255 characters',
            }),
        product: z
            .string({
                invalid_type_error: 'product id is required',
                required_error: 'product id is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: 'product id must be valid.',
            })
            .optional(),
    }).strict(),
});
const updateReviewValidationSchema = z.object({
    body: z.object({
        _id: z
            .string({
                invalid_type_error: 'Product id must be string',
                required_error: 'product id is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: 'Product id must be valid.',
            }),
        status: z.boolean({
            invalid_type_error: 'Rating must be boolean',
            required_error: 'Rating is required',
        }),
    }).strict(),
});

export const ReviewPackageValidations = {
    postReviewValidationSchema,
    updateReviewValidationSchema,
};
