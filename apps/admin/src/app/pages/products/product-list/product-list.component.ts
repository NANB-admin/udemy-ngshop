import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product, ProductsService } from '@angular/products';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-product-list',
  templateUrl: './product-list.component.html',
  styles: [
  ]
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  endSubscriptions$: Subject<any> = new Subject();

  constructor(
    private productService: ProductsService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { }


  ngOnDestroy(): void {
    // console.log('categories is destroyed');
    this.endSubscriptions$.next();
    this.endSubscriptions$.complete();
  }

  ngOnInit(): void {
    this._getProducts();
  }

  private _getProducts() {
    this.productService.getProducts().pipe(takeUntil(this.endSubscriptions$)).subscribe(products => {
      this.products = products;
    })
  }


  deleteProduct(productId: string) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete this product - ${productId}?`,
      header: 'Delete Product',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.deleteProduct(productId).pipe(takeUntil(this.endSubscriptions$)).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product has been deleted.' });
          this._getProducts();
        },
          () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Product was not deleted.' });
            // console.log(error);
          });
      }
    });


  }
  updateProduct(productId: string) {
    this.router.navigateByUrl(`products/form/${productId}`)
  }

}
