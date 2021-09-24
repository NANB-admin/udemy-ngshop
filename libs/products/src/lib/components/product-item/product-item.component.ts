import { Component, Input, OnInit } from '@angular/core';

import { CartItem, CartService } from '@angular/orders'
import { Product } from '../../models/product.model';

@Component({
  selector: 'angular-products-product-item',
  templateUrl: './product-item.component.html',
  styles: [
  ]
})
export class ProductItemComponent implements OnInit {
  @Input() product: Product;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    return;
  }

  addProductToCart() {
    const cartItem: CartItem = {
      productId: this.product.id,
      quantity: 1
    }
    this.cartService.setCartItem(cartItem);
  }

}
