import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule } from '@angular/common/http'
import { ProductService } from './services/product.service';
import { Routes, RouterModule } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import {NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';

// Step 1) Defining Routes
// note: paths don't use leading backslashes, but the redirectTo string does
// note: order is important. routes are listed from most to least specific
const routes: Routes = [
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'search/:keyword', component: ProductListComponent}, // reusing PLC here because we already have functionality
  {path: 'category/:id', component: ProductListComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'products', component: ProductListComponent},
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: '**', redirectTo: '/products', pathMatch: 'full'},
]

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent
  ],
  imports: [
    // Step 2) configure  router
    RouterModule.forRoot(routes),
    BrowserModule,
    // add import for HttpClient Module
    HttpClientModule,
    // add import for NgbModule
    NgbModule,
    ReactiveFormsModule
  ],
  // add our ProductService to providers
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
