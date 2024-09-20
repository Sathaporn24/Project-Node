import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductDto } from '../shared/dtos/product.dto';
import { ProductService } from '../shared/services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { PagingDto } from '../shared/dtos/paging.dto';
import { ConfirmationService, LazyLoadMeta, MessageService, PrimeIcons } from 'primeng/api';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../shared/services/account.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { getImageUrl } from '../shared/utils';

@Component({
  selector: 'app-product-list',
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
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  cols!: unknown[];
  products!: ProductDto[];
  first = 0;
  rows = 3;
  rowsPerPageOptions = [3, 5, 10];
  totalRecords = 0;
  onlyMyItem = false;
  loading = false;
  @ViewChild('table') table!: Table;
  isSeller = false;
  keyword = '';
  getImageUrl = getImageUrl;

  constructor(
    private productService: ProductService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private accountService: AccountService
  ) {
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'imagePath', header: 'Image' },
      { field: 'name', header: 'Name' },
      { field: 'price', header: 'Price' },
      { field: 'ownerName', header: 'Owner' },
      { field: 'actions', header: 'Actions' },
    ];

    this.isSeller = this.accountService.isUserInRole('Seller');
  }

  getProducts(e: LazyLoadMeta) {
    let pageIndex = Math.floor(e.first! / e.rows!) + 1;
    let pageSize = e.rows!;
    this.loading = true;

    this.productService.getProducts(pageIndex, pageSize, this.onlyMyItem, this.keyword).subscribe({
      next: (res: PagingDto<ProductDto>) => {
        this.totalRecords = res.totalItems;
        this.products = res.items;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.message);
        this.loading = false;
      }
    });
  }

  viewItem(item: ProductDto) {
    this.router.navigate(['/product/' + item.id + '/detail']);
  }

  editItem(item: ProductDto) {
    this.router.navigate(['/product/' + item.id + '/edit']);
  }

  deleteItem(item: ProductDto) {
    this.confirmationService.confirm({
      icon: PrimeIcons.EXCLAMATION_TRIANGLE,
      header: 'Delete Item?',
      message: 'Are you sure you want to delete "' + item.name + '"?',
      defaultFocus: 'reject',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.productService.deleteProduct(item.id).subscribe({
          next: (_) => {
            this.messageService.add({
              summary: 'Delete Succeed.',
              detail: '"' + item.name + '" is deleted.',
              severity: "success",
            });

            this.table?.reset();
          },
          error: (err: HttpErrorResponse) => {
            if (!environment.production) console.log(err);
            this.messageService.add({
              summary: 'Delete Failed!',
              detail: '"' + item.name + '" is not deleted.',
              severity: "warn",
            });
          },
        });
      },
    });
  }

  newProduct() {
    this.router.navigate(['/product/new']);
  }

  valueChange(e: CheckboxChangeEvent) {
    this.table?.reset();
  }

  search(e: any) {
    if (e.code === 'Enter' || e.code === undefined) {
      // reset table when user press enter button or search button
      this.table?.reset();
    }
  }

}
