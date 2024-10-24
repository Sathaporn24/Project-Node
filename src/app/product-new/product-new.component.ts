import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ProductService } from '../shared/services/product.service';
import { CreateProductDto } from '../shared/dtos/create-product.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { MessageService } from 'primeng/api';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { ItemsUnit, UnitService } from '../shared/services/unit.service';
import { CategoryService, ItemsCategory } from '../shared/services/category.service';

interface Option {
  name: string;
  code: string;
}

@Component({
  selector: 'app-product-new',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    FloatLabelModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    FileUploadModule,
    DropdownModule
  ],
  templateUrl: './product-new.component.html',
  styleUrl: './product-new.component.css'
})
export class ProductNewComponent implements OnInit {
  productForm!: FormGroup;
  isProcessing = false;
  maxFileSize = environment.maxFileSizeForProductImage;
  accept = environment.allowedMimeTypeForProductImage;

  categoryOptions: Option[] = []; 
  unitOptions: Option[] = [];    

  constructor(
    private router: Router,
    private productService: ProductService,
    private messageService: MessageService,
    private unitService: UnitService,
    private categoryService: CategoryService,
  ) { }

  ngOnInit(): void {
    this.productForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      image: new FormControl(''),
      category: new FormControl('', [Validators.required]), 
      unit: new FormControl('', [Validators.required])  
    });

    this.categoryService.getCategoryAll().subscribe({
      next: (res: any) => {
       this.categoryOptions = res.data;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    });

    this.unitService.getUnitAll().subscribe({
      next: (res: any) => {
       this.unitOptions = res.data;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    });

  }

  validateControl(controlName: string) {
    const control = this.productForm.get(controlName);
    return control?.invalid && control?.touched;
  }

  hasError(controlName: string, errorName: string) {
    const control = this.productForm.get(controlName);
    return control?.hasError(errorName);
  }

  saveChanges() {
    const newcategory = this.productForm.get('category')?.value as ItemsCategory;
    const newUnit = this.productForm.get('unit')?.value as ItemsUnit;
    const req: CreateProductDto = {
      name: this.productForm.get('name')?.value,
      price: this.productForm.get('price')?.value,
      description: this.productForm.get('description')?.value,
      image: this.productForm.get('image')?.value,
      category: newcategory.id,
      unit: newUnit.id,
    };

    this.isProcessing = true;
    this.productForm.disable();

    this.productService.createProduct(req).subscribe({
      next: (_) => {
        this.messageService.add({
          summary: 'Create Succeed.',
          detail: 'New product is created.',
          severity: 'success'
        });

        this.back();
      },
      error: (err: HttpErrorResponse) => {
        if (!environment.production) console.log(err);

        this.messageService.add({
          summary: 'Create Failed!',
          detail: 'New product is not created.',
          severity: 'warn'
        });

        this.isProcessing = false;
        this.productForm.enable();
      },
    });
  }

  back() {
    this.router.navigate(['/product/list']);
  }

  selectFile(e: FileSelectEvent) {
    this.productForm.get('image')?.setValue(e.currentFiles[0]);
  }
}
