import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'orders-order-summary',
  templateUrl: './order-summary.component.html',
  styles: [
  ]
})
export class OrderSummaryComponent implements OnInit, OnDestroy {

  totalPrice: number;
  isCheckout = false;
  endSubs$: Subject<any> = new Subject();

  constructor(private cartService: CartService, private orderService: OrdersService, private router: Router) {
    this.router.url.includes('checkout') ? this.isCheckout = true : this.isCheckout = false;
  }

  ngOnInit(): void {
    this._getOrderSummary();
  }
  ngOnDestroy() {
    this.endSubs$.next();
    this.endSubs$.complete();
  }


  private _getOrderSummary() {
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe(cart => {
      this.totalPrice = 0;
      if (cart) {
        cart.items.map((item) => {
          this.orderService.getProductById(item.productId).pipe(take(1)).subscribe((product) => {
            this.totalPrice += product.price * item.quantity;
          });
        });
      }
    });
  }

  navigateToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
