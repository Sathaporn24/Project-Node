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
    FileUploadModule
  ],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css'
})
export class ProductEditComponent implements OnInit {
  productForm!: FormGroup;
  isProcessing = false;
  maxFileSize = environment.maxFileSizeForProductImage;
  accept = environment.allowedMimeTypeForProductImage;

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

    this.productForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      image: new FormControl(''),
    });

    this.productService.getProduct(id).subscribe({
      next: (res) => {
        this.productForm.get('id')?.setValue(res.id);
        this.productForm.get('name')?.setValue(res.name);
        this.productForm.get('price')?.setValue(res.price);
        this.productForm.get('description')?.setValue(res.description);
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
    const id = this.productForm.get('id')?.value;
    const req: EditProductDto = {
      name: this.productForm.get('name')?.value,
      price: this.productForm.get('price')?.value,
      description: this.productForm.get('description')?.value,
      image: this.productForm.get('image')?.value,
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
