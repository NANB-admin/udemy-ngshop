import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart';

export const CART_KEY = 'cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart$: BehaviorSubject<Cart> = new BehaviorSubject(this.getCart());

  constructor() { }

  initCartLocalStorage() {
    const cart: Cart = this.getCart();
    if (!cart) {
      const initialCart = {
        items: []
      }
      const initialCartJson = JSON.stringify(initialCart)
      localStorage.setItem(CART_KEY, initialCartJson);
    }
  }

  setCartItem(cartItem: CartItem, updateCartItem?: boolean): Cart {
    const cart: Cart = this.getCart();
    const cartItemExist = cart.items.find((item) => item.productId === cartItem.productId);
    if (cartItemExist) {
      cart.items.map(item => {
        if (item.productId === cartItem.productId) {
          if (updateCartItem) {
            item.quantity = cartItem.quantity
          }
          else {
            item.quantity = item.quantity + cartItem.quantity;
          }
          // return item;
        }
      })
    }
    else {
      cart.items.push(cartItem);
    }

    const cartJson = JSON.stringify(cart)
    localStorage.setItem(CART_KEY, cartJson);
    this.cart$.next(cart);
    return cart;
  }

  deleteCartItem(productId: string) {
    const cart: Cart = this.getCart();
    const newCart = cart.items.filter(item => item.productId !== productId);
    cart.items = newCart;

    const cartJson = JSON.stringify(cart)
    localStorage.setItem(CART_KEY, cartJson);
    this.cart$.next(cart);

  }

  getCart(): Cart {
    return JSON.parse(localStorage.getItem(CART_KEY));
  }

  emptyCart() {
    const initialCart = {
      items: []
    };
    const initialCartJson = JSON.stringify(initialCart)
    localStorage.setItem(CART_KEY, initialCartJson);
    this.cart$.next(initialCart);
  }
}
