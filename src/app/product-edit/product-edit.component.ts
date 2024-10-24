import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProductService } from '../shared/services/product.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { EditProductDto } from '../shared/dtos/edit-product.dto';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { ItemsUnit, UnitService } from '../shared/services/unit.service';
import { CategoryService, ItemsCategory } from '../shared/services/category.service';

interface Category {
  id: number;
  cateName: string;
}

interface Unit {
  id: number;
  unName: string;
}

@Component({
  selector: 'app-product-edit',
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
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css'
})
export class ProductEditComponent implements OnInit {
  productForm!: FormGroup;
  isProcessing = false;
  maxFileSize = environment.maxFileSizeForProductImage;
  accept = environment.allowedMimeTypeForProductImage;

  
  categoryOptions: Category[] = []; 
  unitOptions: Unit[] = [];    

  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private messageService: MessageService,
    private unitService: UnitService,
    private categoryService: CategoryService,
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'] || null;

    if (!id) {
      this.warnProductNotFound();
    }

    this.productForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
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

    this.productService.getProduct(id).subscribe({
      next: (res) => {
        this.productForm.get('id')?.setValue(res.id);
        this.productForm.get('name')?.setValue(res.name);
        this.productForm.get('price')?.setValue(res.price);
        this.productForm.get('description')?.setValue(res.description);

        const selectedCategory = this.categoryOptions.find(category => category.id === res.category);
        this.productForm.get('category')?.setValue(selectedCategory);

        const selectedUnit = this.unitOptions.find(unit => unit.id === res.unit);
        this.productForm.get('unit')?.setValue(selectedUnit);

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
    const id = this.productForm.get('id')?.value;
    const req: EditProductDto = {
      name: this.productForm.get('name')?.value,
      price: this.productForm.get('price')?.value,
      description: this.productForm.get('description')?.value,
      image: this.productForm.get('image')?.value,
      category: newcategory.id,
      unit: newUnit.id,
    };

    this.isProcessing = true;
    this.productForm.disable();

    this.productService.editProduct(id, req).subscribe({
      next: (_) => {
        this.messageService.add({
          summary: 'Product Saved!',
          detail: 'Product detail is saved.',
          severity: 'success'
        });

        this.isProcessing = false;
        this.productForm.enable();
      },
      error: (err: HttpErrorResponse) => {
        if (!environment.production) console.log(err);

        this.messageService.add({
          summary: 'Product Not Saved!',
          detail: 'Product detail is not saved.',
          severity: 'warn'
        });

        this.isProcessing = false;
        this.productForm.enable();
      },
    });
  }

  backClick() {
    this.router.navigate(['/product/list']);
  }

  selectFile(e: FileSelectEvent) {
    this.productForm.get('image')?.setValue(e.currentFiles[0]);
  }
}
