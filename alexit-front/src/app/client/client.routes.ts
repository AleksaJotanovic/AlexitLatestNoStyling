import { Routes } from '@angular/router';
import { ClientComponent } from './client.component';
import { ClientMainComponent } from './components/client-main/client-main.component';
import { CartComponent } from './pages/cart/cart.component';
import { AccountComponent } from './pages/account/account.component';
import { ClientProductsComponent } from './pages/client-products/client-products.component';
import { ConfiguratorComponent } from './pages/configurator/configurator.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PaymentMethodsComponent } from './pages/payment-methods/payment-methods.component';
import { TermsOfUsesComponent } from './pages/terms-of-uses/terms-of-uses.component';
import { AboutDeliveryComponent } from './pages/about-delivery/about-delivery.component';
import { BrandsComponent } from './pages/brands/brands.component';
import { ClientProductsPageComponent } from './pages/client-products/client-products-page/client-products-page.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ConfiguratorCartComponent } from './pages/configurator/configurator-cart/configurator-cart.component';
import { PersonalInformationsComponent } from './pages/account/personal-informations/personal-informations.component';
import { FavoriteProductsComponent } from './pages/account/favorite-products/favorite-products.component';
import { PurchaseHistoryComponent } from './pages/account/purchase-history/purchase-history.component';
import { PreviouslyViewedComponent } from './pages/account/previously-viewed/previously-viewed.component';
import { ProductDetailsComponent } from './pages/client-products/product-details/product-details.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { customerRegisteredGuard } from '../admin/guards/customer-registered.guard';
import { ConfirmNewsletterSubscriptionComponent } from '../admin/pages/confirm-newsletter-subscription/confirm-newsletter-subscription.component';
import { offerAvailableGuard } from './guards/offer-available.guard';
import { BlogsListComponent } from './pages/blogs/blogs-list/blogs-list.component';
import { BlogPageComponent } from './pages/blogs/blog-page/blog-page.component';

export const clientRoutes: Routes = [
    {
        path: '', component: ClientComponent, children: [
            { path: '', component: ClientMainComponent },
            { path: 'cart', component: CartComponent },
            { path: 'configuration-cart', component: ConfiguratorCartComponent, canActivate: [customerRegisteredGuard] },
            { path: 'checkout', component: CheckoutComponent, canActivate: [customerRegisteredGuard] },
            {
                path: 'account', component: AccountComponent, canActivate: [customerRegisteredGuard], children: [
                    { path: 'personal-informations', component: PersonalInformationsComponent },
                    { path: 'favorite-products', component: FavoriteProductsComponent },
                    { path: 'purchase-history', component: PurchaseHistoryComponent },
                    { path: 'previously-viewed', component: PreviouslyViewedComponent }
                ]
            },
            {
                path: 'products', component: ClientProductsComponent, children: [
                    { path: ':categoryName/:categoryId', component: ClientProductsPageComponent },
                ]
            },
            { path: 'product/:productId/:productName', component: ProductDetailsComponent },
            { path: 'configurator', component: ConfiguratorComponent },
            { path: 'about-us', component: AboutUsComponent },
            { path: 'contact', component: ContactComponent },
            { path: 'payment-methods', component: PaymentMethodsComponent },
            { path: 'terms-of-uses', component: TermsOfUsesComponent },
            { path: 'about-delivery', component: AboutDeliveryComponent },
            { path: 'brands', component: BrandsComponent },
            { path: 'blogs', component: BlogsListComponent },
            { path: 'blogs/blog/:id/:blogTitle', component: BlogPageComponent }
        ]
    },
    { path: 'confirm-newsletter-subscription/:token', component: ConfirmNewsletterSubscriptionComponent }
];
