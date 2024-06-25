import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { OrderComponent } from './pages/orders/order/order.component';
import { UserComponent } from './pages/users/user/user.component';
import { AddUserComponent } from './pages/users/add-user/add-user.component';
import { LoginComponent } from './pages/login/login.component';
import { loginGuard } from './guards/login.guard';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { usersGuard } from './guards/users.guard';
import { SalesComponent } from './pages/sales/sales.component';
import { ProductsTableComponent } from './pages/products-table/products-table.component';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { OrdersTableComponent } from './pages/orders/orders-table/orders-table.component';
import { UsersTableComponent } from './pages/users/users-table/users-table.component';
import { BlogEditorComponent } from './pages/blogs/blog-editor/blog-editor.component';
import { BlogsTableComponent } from './pages/blogs/blogs-table/blogs-table.component';

export const adminRoutes: Routes = [
    {
        path: 'admin', component: AdminComponent, canActivate: [loginGuard], children: [
            { path: '', component: DashboardComponent },
            { path: 'products', component: ProductsTableComponent },
            { path: 'products/edit-product/:categoryName/:id', component: EditProductComponent },
            { path: 'add-product', component: AddProductComponent },
            { path: 'categories', component: CategoriesComponent },
            { path: 'orders', component: OrdersTableComponent },
            { path: 'orders/order/:id', component: OrderComponent },
            { path: 'users', component: UsersTableComponent, canActivate: [usersGuard] },
            { path: 'users/user/:id', component: UserComponent },
            { path: 'users/add-user', component: AddUserComponent },
            { path: 'sales', component: SalesComponent, canActivate: [usersGuard] },
            { path: 'blogs', component: BlogsTableComponent }
        ],
    },
    { path: 'admin/login', component: LoginComponent },
    { path: 'admin/forget-password', component: ForgetPasswordComponent },
    { path: 'admin/reset/:token', component: ResetPasswordComponent },
    { path: 'admin/blogs/blog-editor', component: BlogEditorComponent },
    { path: 'admin/blogs/blog-editor/:id', component: BlogEditorComponent }
];
