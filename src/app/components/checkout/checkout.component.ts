import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutFormService } from 'src/app/services/checkout-form.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { MyShopValidators } from 'src/app/validators/my-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingStates: State[] = [];
  billingStates: State[] = [];

  constructor(private formBuilder: FormBuilder, 
    private formService: CheckoutFormService, 
    private cartService: CartService, 
    private checkoutService: CheckoutService, 
    private router: Router ) {}

  ngOnInit() {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), MyShopValidators.notOnlyWhiteSpace]), 
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), MyShopValidators.notOnlyWhiteSpace]), 
        email: new FormControl('', [Validators.required, Validators.email])
        //regex pattern for matching on emails: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
      }),
      shippingAddress: this.formBuilder.group({
        city: new FormControl('', [Validators.required, MyShopValidators.notOnlyWhiteSpace]),
        street: new FormControl('', [Validators.required, MyShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, MyShopValidators.notOnlyWhiteSpace])
      }),
      billingAddress: this.formBuilder.group({
        city: new FormControl('', [Validators.required, MyShopValidators.notOnlyWhiteSpace]),
        street: new FormControl('', [Validators.required, MyShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, MyShopValidators.notOnlyWhiteSpace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), MyShopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    // populate credit card months (js months are base zero, so + 1)
    const startMonth = new Date().getMonth() + 1;
    console.log("Start month: " + startMonth);

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieving credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // populate credit card years
    this.formService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieving credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    // populate countries
    this.formService.getCountries().subscribe(
      data => {
        console.log("Retrieving countries: " + JSON.stringify(data));
        this.countries = data;
      }
    )
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }

  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }

  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); } 
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); } 
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); } 
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); } 

  reviewCartDetails() {
    // subscribe to cartService.totalQuantity and totalPrice
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );

  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    // if the current year == selected year then start with current month
    let startMonth: number;
    if (currentYear == selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  onSubmit() {
    console.log('Handling form submission...');
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    console.log(this.checkoutFormGroup.get('customer').value);
    // if you want specific values...
    console.log(`The email address is: ${this.checkoutFormGroup.get('customer').value.email}`);
    
    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    // ~long way
    let orderItems: OrderItem[] = [];
    for (let item of cartItems) {
      orderItems.push(new OrderItem(item));
    }

    // ~short way
    let orderItemsShort: OrderItem[] = cartItems.map(item => new OrderItem(item));

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shippingAddress
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - billingAddress
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
          // reset the cart
          this.resetCart();
        },
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    )
  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset form data
    this.checkoutFormGroup.reset();

    // return to main products page
    this.router.navigateByUrl("/products");
  }

  copyShippingToBilling(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
      .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      // bug fix for states not copying over after implementing getStates(countryCode)
      this.billingStates = this.shippingStates;
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;
    
    console.log('Form group: ' + formGroup);
    console.log('Country code: ' + countryCode, ' Country name: ' + countryName);

    this.formService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingStates = data;
        }
        else {
          this.billingStates = data;
        }

        // select first state/province as default
        formGroup.get('state').setValue(data[0]);
      }
    );
  }
}



