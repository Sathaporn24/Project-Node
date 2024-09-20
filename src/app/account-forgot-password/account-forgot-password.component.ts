import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ForgotPasswordDTO } from '../shared/dtos/forgot-password.dto';
import { MessageService } from 'primeng/api';
import { AccountService } from '../shared/services/account.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-account-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './account-forgot-password.component.html',
  styleUrl: './account-forgot-password.component.css'
})
export class AccountForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  isProcessing = false;

  constructor(private messageService: MessageService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  validateControl(controlName: string) {
    const control = this.forgotPasswordForm.get(controlName);
    return control?.invalid && control?.touched;
  }

  hasError(controlName: string, errorName: string) {
    const control = this.forgotPasswordForm.get(controlName);
    return control?.hasError(errorName);
  }

  forgotPassword() {
    const req: ForgotPasswordDTO = {
      email: this.forgotPasswordForm.get('email')?.value,
      clientURI: location.origin + '/account/resetpassword'
    };

    this.forgotPasswordForm.disable();
    this.isProcessing = true;
    this.messageService.clear();

    this.accountService.forgotPassword(req).subscribe({
      next: (_) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Forget Password Succeeded',
          detail: 'The link has been sent, please check your email to reset your password.',
          sticky: true
        });
        this.isProcessing = false;
        this.forgotPasswordForm.enable();
        this.forgotPasswordForm.reset();
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Forgot Password Failed',
          detail: err.message,
          sticky: true
        });
        this.isProcessing = false;
        this.forgotPasswordForm.enable();
      }
    });
  }

}
