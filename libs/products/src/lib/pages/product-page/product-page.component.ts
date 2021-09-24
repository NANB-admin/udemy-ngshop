import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartItem, CartService } from '@angular/orders';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'angular-product-page',
  templateUrl: './product-page.component.html',
  styles: [
  ]
})
export class ProductPageComponent implements OnInit, OnDestroy {

  product: Product;
  constructor(private productsService: ProductsService, private activatedRoute: ActivatedRoute, private cartService: CartService) { }
  endSubs$: Subject<any> = new Subject();
  quantity = 1;

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params.productid) {
        this._getProduct(params.productid);
      }
    })
  }



  private _getProduct(id: string) {
    this.productsService.getProductById(id).pipe(takeUntil(this.endSubs$)).subscribe(resProduct => {
      if (resProduct.images.length === 0) {
        resProduct.images = [resProduct.image];
      }
      this.product = resProduct;
    });
  }

  addProductToCart() {
    const cartItem: CartItem = {
      productId: this.product.id,
      quantity: this.quantity
    }
    this.cartService.setCartItem(cartItem);
  }
}
