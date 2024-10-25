import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../shared/services/product.service';
import { Router } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { HttpErrorResponse } from '@angular/common/http';
import { DataViewModule } from 'primeng/dataview';
import Swal from 'sweetalert2';
import { FavoriteService } from '../shared/services/favorite.service';

export interface Item {
  id: string;
  name: string;
  price: number;
  description: string | null;
  idCate: string | null;
  idUn: string | null;
  imagePath: string | null;
  createdBy: string;
  createdTime: string;
  updatedBy: string | null;
  updatedTime: string | null;
  owner: string | null;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ButtonGroupModule,
    CardModule,
    InputGroupModule,
    FormsModule,
    FloatLabelModule,
    DataViewModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchProduct: string = '';
  products: Item[] = [];

  constructor(
    private productService: ProductService,
    private favoriteService: FavoriteService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.allProduct().subscribe({
      next: (res: any) => {
        this.products = res.data;
      },
      error: (err: HttpErrorResponse) => {
        Swal.fire('Failed to load products. Please try again later.');
      }
    });
  }

  updateFilteredData() {
    if (this.searchProduct) {
      this.productService.searchProduct(this.searchProduct).subscribe({
        next: (res: any) => {
          this.products = res.data; 
        },
        error: (err: HttpErrorResponse) => {
          Swal.fire('Failed to load filtered products. Please try again later.');
        }
      });
    } else {
      this.loadProducts(); 
    }
  }

  addToFavorites(productId: string) {
    this.favoriteService.addFavorites(productId).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Added to Favorites!',
          text: res.messages,
          confirmButtonText: 'Okay'
        });
      },
      error: (err: HttpErrorResponse) => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: err.message,
          confirmButtonText: 'Okay'
        });
      }
    });
  }

  getDetailProduct(productId: string) {
    this.productService.detailProduct(productId).subscribe({
      next: (res: any) => {
        const product = res.data; 
        Swal.fire({
          title: product.name,
          html: `
            <div style="text-align: left;">
              <img src="${environment.apiBaseUrl}${product.imagePath}" alt="${product.name}" style="width: 100%; max-width: 200px; margin-bottom: 10px;" />
              <p><strong>Price:</strong> $${product.price}</p>
              <p><strong>Description:</strong> ${product.description || 'No description available.'}</p>
              <p><strong>Category:</strong> ${product.category}</p>
              <p><strong>Unit:</strong> ${product.unit}</p>
            </div>
          `,
          showCloseButton: true,
          focusConfirm: false,
          confirmButtonText: 'Close',
        });
      },
      error: (err: HttpErrorResponse) => {
        Swal.fire('Failed to load product details. Please try again later.');
      }
    });
  }

  getImageUrl(imagePath: string | null): string {
    return imagePath ? `${environment.apiBaseUrl}/${imagePath}` : 'assets/default-image.png';
  }
}
