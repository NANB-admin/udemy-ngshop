import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoriesService, Category, Product, ProductsService } from '@angular/products';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'angular-products-list',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsListComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  categories: Category[] = [];
  isCategoryPage: boolean;
  endSubs$: Subject<any> = new Subject();

  constructor(private productService: ProductsService, private categoriesService: CategoriesService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      params.categoryid ? this._getProducts([params.categoryid]) : this._getProducts();
      params.categoryid ? this.isCategoryPage = true : this.isCategoryPage = false;
    });

    this._getCategories();
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }
  private _getProducts(categoriesFilter?: string[]) {
    this.productService.getProducts(categoriesFilter).pipe(takeUntil(this.endSubs$)).subscribe(responseProducts => {
      this.products = responseProducts;
    })
  }

  private _getCategories() {
    this.categoriesService.getCategories().pipe(takeUntil(this.endSubs$)).subscribe(responseCategories => {
      this.categories = responseCategories;
    })
  }

  categoryFilter() {
    // console.log(this.categories);
    const selectedCategories = this.categories.filter(category => category.checked).map((category) => category.id);

    this._getProducts(selectedCategories);
  };

}
