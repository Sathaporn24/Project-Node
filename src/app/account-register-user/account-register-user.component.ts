import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CustomValidatorService } from '../shared/services/custom-validator.service';
import { RegisterUserDto } from '../shared/dtos/register-user.dto';
import { AccountService } from '../shared/services/account.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-account-register-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    FloatLabelModule,
    InputTextModule,
    RadioButtonModule,
    PasswordModule,
    ButtonModule
  ],
  templateUrl: './account-register-user.component.html',
  styleUrl: './account-register-user.component.css'
})
export class AccountRegisterUserComponent implements OnInit {
  returnUrl = '';
  roles = ['Customer', 'Seller'];
  registerForm!: FormGroup;
  isProcessing = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private customeValidatorService: CustomValidatorService,
    private accountService: AccountService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/';
    });

    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    });

    this.registerForm.get('confirmPassword')?.addValidators(this.customeValidatorService.mismatched(this.registerForm.get('password')!));
  }

  validateControl(controlName: string) {
    const control = this.registerForm.get(controlName);
    return control?.invalid && control?.touched;
  }

  hasError(controlName: string, errorName: string) {
    const control = this.registerForm.get(controlName);
    return control?.hasError(errorName);
  }

  registerUser() {
    const req: RegisterUserDto = {
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      role: this.registerForm.get('role')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      confirmPassword: this.registerForm.get('confirmPassword')?.value,
    };

    this.registerForm.disable();
    this.messageService.clear();
    this.isProcessing = true;

    this.accountService.register(req).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Register Succeeded',
          detail: 'Your account is created.'
        });
        setTimeout(() => {
          this.router.navigate(['/account/login'], { queryParams: { returnUrl: this.returnUrl } });
        }, 1500);
      },
      error: (err: HttpErrorResponse) => {
        this.registerForm.enable();
        this.messageService.add({
          severity: 'error',
          summary: 'Register Failed',
          detail: err.message,
          sticky: true
        });
        this.isProcessing = false;
      }
    });
  }

}
