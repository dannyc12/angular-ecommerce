import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent {
  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.updateCartStatus();
  }

  updateCartStatus() {
    //
    // when new events are received, make the assignment to update the UI
    //

    // subscribe to the cart TotalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // subscribe to the cart TotalQuantity 
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

}
