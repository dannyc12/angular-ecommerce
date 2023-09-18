import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Step 7) update param to make use of searchUrl

  // our backend server origin (Spring Boot App)
  private baseUrl = "http://localhost:8080/api/products";

  private categoryUrl = "http://localhost:8080/api/product-category";


  constructor(private httpClient: HttpClient) { }

  getProductList(categoryId: number): Observable<Product[]> {

    // Step 7) Update service to call new URL on Spring Boot app
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;

    // Step 7) update param to make use of searchUrl
    return this.getProducts(searchUrl);
  }

  getProductListPaginate(page: number, pageSize: number, categoryId: number): Observable<GetResponseProducts> {

    // Step 7) Update service to call new URL on Spring Boot app based on category id, page and page size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}` 
                      + `&page=${page}&size=${pageSize}`;

  
    // Step 7) update param to make use of searchUrl
    return this.httpClient.get<GetResponseProducts>(searchUrl);;
  }

  searchProducts(keyword: string): Observable<Product[]> {

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;
    return this.getProducts(searchUrl);
  }

  searchProductstPaginate(page: number, pageSize: number, keyword: string): Observable<GetResponseProducts> {

    // Step 7) Update service to call new URL on Spring Boot app based on keyword, page and page size
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}` 
                      + `&page=${page}&size=${pageSize}`;

    // Step 7) update param to make use of searchUrl
    return this.httpClient.get<GetResponseProducts>(searchUrl);;
  }

  getProduct(productId: number): Observable<Product> {
    // build URl with productId
    const productUrl = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }
}

interface GetResponseProducts {
  // this will help us unwrap the JSON data from the Spring Data REST API as an array of products
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  // this will help us unwrap the JSON data from the Spring Data REST API as an array of products
  _embedded: {
    productCategory: ProductCategory[];
  }
}