import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import Swal from 'sweetalert2';
import { FavoriteService } from '../shared/services/favorite.service';
import { environment } from '../../environments/environment.development';
import { ProductService } from '../shared/services/product.service';


@Component({
  selector: 'app-favorites-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    ButtonGroupModule,
    TooltipModule,
    CheckboxModule,
    InputGroupModule
  ],
  templateUrl: './favorites-list.component.html',
  styleUrl: './favorites-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FavoritesListComponent implements OnInit {
  favorites: any[] =  [];
  constructor(
    private cdr: ChangeDetectorRef,
    private favoriteService: FavoriteService,
    private productService: ProductService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadFavorites();
  }

  async loadFavorites(){
    this.favoriteService.allFavorite().subscribe({
      next: (res: any) => {
       this.favorites = res.data;
       this.cdr.markForCheck();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    });
  }


  deleteFavorites(id: string){
  Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.favoriteService.delFavorite(id).subscribe({
          next: async (req) => {
            await this.loadFavorites();
            Swal.fire('Deleted!', 'Your Favorite has been deleted.', 'success');
          },
          error: (err: HttpErrorResponse) => {
            Swal.fire('Error!', 'Failed to add Favorite. Please try again.', 'error');
          }
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
