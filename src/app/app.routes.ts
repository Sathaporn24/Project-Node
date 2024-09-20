import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductNewComponent } from './product-new/product-new.component';
import { AccountRegisterUserComponent } from './account-register-user/account-register-user.component';
import { AccountLoginUserComponent } from './account-login-user/account-login-user.component';
import { authGuard } from './shared/guards/auth.guard';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { sellerGuard } from './shared/guards/seller.guard';
import { AccountForgotPasswordComponent } from './account-forgot-password/account-forgot-password.component';
import { AccountResetPasswordComponent } from './account-reset-password/account-reset-password.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductEditComponent } from './product-edit/product-edit.component';

export const routes: Routes = [
    {
        path: 'home',
        title: 'Home',
        component: HomeComponent
    },
    {
        path: 'product',
        children: [
            {
                path: 'list',
                title: 'All Products',
                component: ProductListComponent,
                canActivate: [authGuard]
            },
            {
                path: 'new',
                title: 'New Product',
                component: ProductNewComponent,
                canActivate: [authGuard, sellerGuard]
            },
            {
                path: ':id/detail',
                title: 'Product Detail',
                component: ProductDetailComponent,
                canActivate: [authGuard]
            },
            {
                path: ':id/edit',
                title: 'Edit Product',
                component: ProductEditComponent,
                canActivate: [authGuard, sellerGuard]
            }
        ]
    },
    {
        path: 'account',
        children: [
            {
                path: 'register',
                title: 'Register',
                component: AccountRegisterUserComponent
            },
            {
                path: 'login',
                title: 'Login',
                component: AccountLoginUserComponent
            },
            {
                path: 'forgotpassword',
                title: 'Forgot Password',
                component: AccountForgotPasswordComponent
            },
            {
                path: 'resetpassword',
                title: 'Reset Password',
                component: AccountResetPasswordComponent
            }
        ]
    },
    {
        path: 'forbidden',
        component: ForbiddenComponent
    },
    {
        path: '404',
        component: NotFoundComponent
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home'
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: '/404'
    }
];
