import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ProductDto } from '../dtos/product.dto';
import { environment } from '../../../environments/environment.development';
import { ProductDetailDTO } from '../dtos/product-detail.dto';
import { CreateProductDto } from '../dtos/create-product.dto';
import { EditProductDto } from '../dtos/edit-product.dto';
import { PagingDto } from '../dtos/paging.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) { }

  getProducts(pageIndex: number, pageSize: number, onlyMyItem: boolean, keyword: string) {
    let reqUrl = environment.apiBaseUrl + '/products';
    reqUrl += '?pageIndex=' + pageIndex;
    reqUrl += '&pageSize=' + pageSize;
    reqUrl += '&onlyMyItem=' + onlyMyItem;
    if (keyword) {
      reqUrl += '&keyword=' + encodeURIComponent(keyword);
    }
    return this.http.get<PagingDto<ProductDto>>(reqUrl);
  }

  getProduct(id: string) {
    let reqUrl = environment.apiBaseUrl + '/products/' + id;
    return this.http.get<ProductDetailDTO>(reqUrl);
  }

  createProduct(req: CreateProductDto) {
    const formData = new FormData();
    formData.append('name', req.name);
    formData.append('price', req.price.toString());
    if (req.description) {
      formData.append('description', req.description);
    }
    if (req.image) {
      formData.append('image', req.image, req.image.name);
    }
    let reqUrl = environment.apiBaseUrl + '/products';
    return this.http.post<ProductDetailDTO>(reqUrl, formData);
  }

  editProduct(id: string, req: EditProductDto) {
    const formData = new FormData();
    formData.append('name', req.name);
    formData.append('price', req.price.toString());
    if (req.description) {
      formData.append('description', req.description);
    }
    if (req.image) {
      formData.append('image', req.image, req.image.name);
    }
    let reqUrl = environment.apiBaseUrl + '/products/' + id;
    return this.http.put<unknown>(reqUrl, formData);
  }

  deleteProduct(id: string) {
    let reqUrl = environment.apiBaseUrl + '/products/' + id;
    return this.http.delete<unknown>(reqUrl);
  }
}
