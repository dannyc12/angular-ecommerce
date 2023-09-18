import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  cartItems: CartItem[] = [];
  // subject is a subclass of observable, used to publish events in our code
  // the event will be sent to all of the subscribers
  totalPrice: Subject<number> = new BehaviorSubject<number>(0); 
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0); 

  constructor() { }

  subtractFromCart(cartItem: CartItem) {
    cartItem.quantity--;

    if (cartItem.quantity == 0) {
      this.remove(cartItem);
    }
    else {
      this.computeCartTotals();
    }
  }

  addToCart(cartItem: CartItem) {
    // check if we already have the item in cart
    let alreadyInCart: boolean = false;
    let existingCartItem: CartItem = undefined; // had to edit tsconfig.json ('strict': false) to allow this assignment

    if (this.cartItems.length > 0) {
      // find the item in cart by id
      // for (let item of this.cartItems) {
      //   if (item.id == cartItem.id) {
      //     existingCartItem = item;
      //     break;
      //   }

      // using .find() method
      existingCartItem = this.cartItems.find( currentItem => currentItem.id === cartItem.id );

    
      // check if we found it
      alreadyInCart = (existingCartItem != undefined);
    }

    if (alreadyInCart) {
      existingCartItem.quantity++;
    }
    else {
      this.cartItems.push(cartItem);
    }

    // compute cart total price and quantity
    this.computeCartTotals();
    
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let item of this.cartItems) {
      totalPriceValue += item.unitPrice * item.quantity;
      totalQuantityValue += item.quantity
    }

    // publish the new values ... all subscribers will receive the new data
    // .next() publishes/sends the event (one event for total price, one event for total quantity)
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue)

    // log cart data for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart: ');
    for (let item of this.cartItems) {
      const subTotalPrice = item.quantity * item.unitPrice;
      console.log(`name: ${item.name}, quantity: ${item.quantity}, unit price: ${item.unitPrice}, subtotal: ${subTotalPrice}`);

      // toFixed is a number format
      console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`); 
      console.log('--------');
    }
  }

  remove(cartItem: CartItem) {
    // get the index of item in array
    const itemIndex = this.cartItems.findIndex(item => item.id == cartItem.id)
    // if found, remove item from array at index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1); // (itemIndex, 1) means remove 1 item at itemIndex
      this.computeCartTotals();
    }
  }


}
