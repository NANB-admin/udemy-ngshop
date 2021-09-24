import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductsSearchComponent } from './components/products-search/products-search.component';
import { CategoriesBannerComponent } from './components/categories-banner/categories-banner.component';
import { FeaturedProductComponent } from './components/featured-product/featured-product.component';
import { ButtonModule } from 'primeng/button';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { RatingModule } from 'primeng/rating';
import { InputNumberModule } from 'primeng/inputnumber';
import { UiModule } from '@angular/ui';
import { ProductItemComponent } from './components/product-item/product-item.component';

const routes: Routes = [
  {
    path: 'products',
    component: ProductsListComponent
  },
  {
    path: 'category/:categoryid',
    component: ProductsListComponent
  },
  {
    path: 'products/:productid',
    component: ProductPageComponent
  },
];

@NgModule({
  imports: [ButtonModule, CheckboxModule, CommonModule, FormsModule, InputNumberModule, RatingModule, RouterModule.forChild(routes), UiModule],
  declarations: [
    ProductsSearchComponent,
    CategoriesBannerComponent,
    FeaturedProductComponent,
    ProductItemComponent,
    ProductsListComponent,
    ProductPageComponent,
  ],
  exports: [ProductsSearchComponent, CategoriesBannerComponent, FeaturedProductComponent, ProductItemComponent, ProductsListComponent, ProductPageComponent]
})
export class ProductsModule { }

