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
import { AccountService } from '../../shared/services/account.service';
import Swal from 'sweetalert2';
import { CategoryService, ItemsCategory } from '../../shared/services/category.service';

@Component({
  selector: 'app-unit-list',
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
  templateUrl: './unit-list.component.html',
  styleUrl: './unit-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class UnitListComponent implements OnInit {
  categories: ItemsCategory[] = [];
  isSeller = false;
  constructor(
    private cdr: ChangeDetectorRef,
    private accountService: AccountService,
    private categoryService: CategoryService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.isSeller = this.accountService.isUserInRole('Seller');
    await this.getCategory();
  }

  async getCategory(){
    this.categoryService.getCategoryAll().subscribe({
      next: (res: any) => {
       this.categories = res.data;
       this.cdr.markForCheck();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    });
  }

  async addCategory(){
    const { value: userInput } = await Swal.fire({
      title: 'Category name',
      input: 'text',
      inputLabel: 'Name Category',
      inputPlaceholder: 'Enter your Category here',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
        return null;
      }
    });

    if(userInput){
      this.categoryService.addCategory(userInput).subscribe({
        next: async (newCategory) => {
          await this.getCategory();
          Swal.fire('Success!', 'Category added successfully!', 'success');
        },
        error: (err: HttpErrorResponse) => {
          Swal.fire('Error!', 'Failed to add category. Please try again.', 'error');
        }
      });
    }
  }

  editCategory(category: ItemsCategory) {
    Swal.fire({
      title: 'Edit Category Name',
      input: 'text',
      inputLabel: 'Update Category Name',
      inputValue: category.cateName, 
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.editCategory(category.id, result.value).subscribe({
          next: async () => {
            await this.getCategory();
            Swal.fire('Success!', 'Category update successfully!', 'success');
          },
          error: (err: HttpErrorResponse) => {
            Swal.fire('Error!', 'Failed to add category. Please try again.', 'error');
          }
        });
      }
    });
  }

  deleteCategory(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.delCategory(id).subscribe({
          next: async () => {
            await this.getCategory();
            Swal.fire('Deleted!', 'Your category has been deleted.', 'success');
          },
          error: (err: HttpErrorResponse) => {
            Swal.fire('Error!', 'Failed to add category. Please try again.', 'error');
          }
        });
      }
    });
  }


}
