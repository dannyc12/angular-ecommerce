import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',

  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {

  products: Product[] = [];
  // Step 5) Enhance ProductListComponent to read CategoryId param, inject the route into constructor, update ngOnInit
  // with this.route.paramMap.subscribe
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // new properties for pagination
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;

  previousKeyword: string = "";
  

  constructor(private productService: ProductService, private cartService: CartService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword'); // 'has' returns a boolean

    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const keyword = this.route.snapshot.paramMap.get('keyword')!; // '!' tells compiler that object is not null

    // if we have a different keyword than previous set the page # to 1
    if (this.previousKeyword != keyword) {
      this.pageNumber = 1;
    }

    this.previousKeyword = keyword;
    console.log(`keyword=${keyword}, pageNumber=${this.pageNumber}`);

    this.productService.searchProductstPaginate(this.pageNumber - 1, this.pageSize, keyword)
                       .subscribe(this.processResult());
  }

  handleListProducts() {
    // Subscribing to an observable executes the observable function, turns the
    // observer object into an internal subscriber object, and returns a subscription object

    // Step 5) cont.: check if categoryId param is available
    // route: activated route, snapshot: state of the route at this given time, paramMap: map of all the route params
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string, convert string to number by using '+' >> '!' tells compiler that object is not null
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else {
      // not category available ... default to category id = 1
      this.currentCategoryId = 1;
    }

    // check if we have a different category than pervious
    // NOTE: angular will reuse a component if it is currently being viewed

    // if we have a different category id than previous, reset the page number back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, pageNumber=${this.pageNumber}`);

    // now actually get the products for this category id >> update method in product service
    // pageNumber -1 because in Spring Boot REST pages are zero based, in Angular pagination pages are 1 based
    this.productService.getProductListPaginate(this.pageNumber - 1, 
                                              this.pageSize, 
                                              this.currentCategoryId).subscribe(this.processResult());
  }

  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }

  addToCart(product: Product) {
    console.log(`Adding to cart: ${product.name}, product price: ${product.unitPrice}`);

    const cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }
}
