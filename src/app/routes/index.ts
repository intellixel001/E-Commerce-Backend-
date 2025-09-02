import { Router } from 'express';
import { settingRoutes } from '../modules/setting/setting.route';
import { fileRouters } from '../modules/file/file.route';
import { userRoutes } from '../modules/user/user.route';
import { otpRoutes } from '../modules/otp/otp.route';
import { authRoutes } from '../modules/auth/auth.route';
import { languageRoutes } from '../modules/setting-language/setting-language.route';
import { hrmRoleRoutes } from '../modules/hrm-role/hrm-role.route';
import { pageRoutes } from '../modules/setting-page/setting-page.route';
import { tagRoutes } from '../modules/blog-tag/blog-tag.route';
import { blogCategoryRoutes } from '../modules/blog-category/blog-category.route';
import { blogRoutes } from '../modules/blog/blog.route';
import { faqRoutes } from '../modules/faq/faq.route';
import { subscriberRoutes } from '../modules/subscriber/subscriber.route';
import { serviceRoutes } from '../modules/service/service.route';
import { contactRoutes } from '../modules/contact/contact.route';
import { productCategoryRoutes } from '../modules/product-category/product-category.route';
import { productRoutes } from '../modules/product/product.route';
import { dashboardRoutes } from '../modules/dashboard/dashboard.route';
import { paymentRoutes } from '../modules/payment/payment.route';
import { reviewRoutes } from '../modules/review/review.route';
import { cartRoutes } from '../modules/cart/cart.route';
import { testimonialRoutes } from '../modules/testimonial/testimonial.route';

const router = Router();

const moduleRouters = [
    {
        path: '/users',
        route: userRoutes,
    },
    {
        path: '/auth',
        route: authRoutes,
    },
    {
        path: '/hrm/roles',
        route: hrmRoleRoutes,
    },
    {
        path: '/otps',
        route: otpRoutes,
    },
    {
        path: '/files',
        route: fileRouters,
    },
    {
        path: '/subscribers',
        route: subscriberRoutes,
    },
    {
        path: '/blogs',
        route: blogRoutes,
    },
    {
        path: '/blog-categories',
        route: blogCategoryRoutes,
    },
    {
        path: '/blog-tags',
        route: tagRoutes,
    },
    {
        path: '/payments',
        route: paymentRoutes,
    },
    {
        path: '/faqs',
        route: faqRoutes,
    },
    {
        path: '/contacts',
        route: contactRoutes,
    },

    {
        path: '/products',
        route: productRoutes,
    },
    {
        path: '/carts',
        route: cartRoutes,
    },
    {
        path: '/product-categories',
        route: productCategoryRoutes,
    },
    {
        path: '/reviews',
        route: reviewRoutes,
    },
    {
        path: '/services',
        route: serviceRoutes,
    },
    {
        path: '/testimonials',
        route: testimonialRoutes,
    },
    {
        path: '/dashboards',
        route: dashboardRoutes,
    },
    {
        path: '/settings',
        route: settingRoutes,
    },
    {
        path: '/settings/languages',
        route: languageRoutes,
    },
    {
        path: '/settings/pages',
        route: pageRoutes,
    },
];

moduleRouters.forEach((route) => router.use(route.path, route.route));
export default router;
