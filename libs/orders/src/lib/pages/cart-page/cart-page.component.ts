import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartItemDetail } from '../../models/cart';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
//import { ProductsService } from '@angular/products';

@Component({
  selector: 'orders-cart-page',
  templateUrl: './cart-page.component.html',
  styles: [
  ]
})
export class CartPageComponent implements OnInit, OnDestroy {

  cartItemDetails: CartItemDetail[] = [];
  cartCount = 0;
  endSubs$: Subject<any> = new Subject();

  constructor(private router: Router, private cartService: CartService, private ordersService: OrdersService) { }

  ngOnInit(): void {
    this._getCartDetails();
  }
  ngOnDestroy() {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  backToShop() {
    this.router.navigate(['/products']);
  }

  deleteCartItem(cartItem: CartItemDetail) {
    this.cartService.deleteCartItem(cartItem.product.id);
  }

  private _getCartDetails() {
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe(respCart => {
      this.cartItemDetails = [];
      this.cartCount = respCart?.items?.length ?? 0;
      respCart.items.forEach(cartItem => {
        this.ordersService.getProductById(cartItem.productId).subscribe(resProduct => {
          this.cartItemDetails.push({
            product: resProduct,
            quantity: cartItem.quantity
          });
        });
      })
    });
  }

  updateCartItemQuantity(event, cartItem: CartItemDetail) {
    // console.log(event);
    this.cartService.setCartItem(
      {
        productId: cartItem.product.id,
        quantity: event.value
      },
      true
    );
  }
}
