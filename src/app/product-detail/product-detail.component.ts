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
import { UnitService } from '../shared/services/unit.service';
import { CategoryService, ItemsCategory } from '../shared/services/category.service';

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
  categoryName! : ItemsCategory;
  getImageUrl = getImageUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private messageService: MessageService,
    private categoryService: CategoryService,
    private unitService: UnitService,
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'] || null;

    if (!id) {
      this.warnProductNotFound();
    }

    this.productService.getProduct(id).subscribe({
      next: (res) => {
        this.product = res;
        this.CateUnit(res.category, res.unit);
      },
      error: (err: HttpErrorResponse) => {
        if (!environment.production) console.log(err);
        this.warnProductNotFound();
      }
    });
  }
  private CateUnit(IdCate : number, IdUn : number){
    this.categoryService.idCategory(IdCate).subscribe({
      next: (res) => {
        this.product.cateName = res.data.cateName;
      },
      error: (err: HttpErrorResponse) => {
        if (!environment.production) console.log(err);
        this.warnProductNotFound();
      }
    });

    this.unitService.idUnit(IdUn).subscribe({
      next: (res) => {
        this.product.unName = res.data.unName;
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
