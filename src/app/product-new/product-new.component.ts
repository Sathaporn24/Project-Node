import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ProductService } from '../shared/services/product.service';
import { CreateProductDto } from '../shared/dtos/create-product.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { MessageService } from 'primeng/api';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';

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
    FileUploadModule
  ],
  templateUrl: './product-new.component.html',
  styleUrl: './product-new.component.css'
})
export class ProductNewComponent implements OnInit {
  productForm!: FormGroup;
  isProcessing = false;
  maxFileSize = environment.maxFileSizeForProductImage;
  accept = environment.allowedMimeTypeForProductImage;

  constructor(
    private router: Router,
    private productService: ProductService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.productForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      image: new FormControl('')
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
    const req: CreateProductDto = {
      name: this.productForm.get('name')?.value,
      price: this.productForm.get('price')?.value,
      description: this.productForm.get('description')?.value,
      image: this.productForm.get('image')?.value,
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
