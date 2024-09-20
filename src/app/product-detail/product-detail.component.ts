import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProductDetailDTO } from '../shared/dtos/product-detail.dto';
import { ProductService } from '../shared/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { MessageService } from 'primeng/api';
import { getImageUrl } from '../shared/utils';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product!: ProductDetailDTO;
  getImageUrl = getImageUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'] || null;

    if (!id) {
      this.warnProductNotFound();
    }

    this.productService.getProduct(id).subscribe({
      next: (res) => {
        this.product = res;
      },
      error: (err: HttpErrorResponse) => {
        if (!environment.production) console.log(err);

        this.warnProductNotFound();
      }
    });
  }

  private warnProductNotFound() {
    this.messageService.add({
      summary: 'Product Not Found!',
      detail: 'Product detail is not found.',
      severity: 'warn'
    });

    this.backClick();
  }

  backClick() {
    this.router.navigate(['/product/list']);
  }
}
