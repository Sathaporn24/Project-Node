import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, PrimeIcons } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, authKey } from '../shared/services/account.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MenubarModule,
    ButtonModule,
    MenuModule,
    SplitButtonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isUserAuthenticated = false;
  mainMenuItems!: MenuItem[];
  userMenuItems!: MenuItem[];
  fullName = '';
  isUpdate!: boolean;
  
  constructor(private router: Router, private route: ActivatedRoute, private accountService: AccountService, private confirmService: ConfirmationService) {
    accountService.authChanged.subscribe(res => {
      this.isUserAuthenticated = res;
      this.fullName = accountService.getUserFullName();
    });
  }

  ngOnInit(): void {
    this.mainMenuItems = [
      {
        label: 'Product',
        items: [
          {
            label: 'All',
            icon: PrimeIcons.LIST,
            routerLink: '/product/list'
          },
          {
            label: 'New',
            icon: PrimeIcons.PLUS,
            routerLink: '/product/new'
          }
        ]
      },
      {
        label: 'Category',
        items: [
          {
            label: 'All',
            icon: PrimeIcons.LIST,
            routerLink: '/category/list'
          }
        ]
      },
      {
        label: 'Unit',
        items: [
          {
            label: 'All',
            icon: PrimeIcons.LIST,
            routerLink: '/unit/list'
          }
        ]
      },
      {
        label: 'Favorites',
        items: [
          {
            label: 'All',
            icon: PrimeIcons.LIST,
            routerLink: '/favorites/list'
          }
        ]
      },
    ];

    this.userMenuItems = [
      {
        label: 'Log out',
        icon: PrimeIcons.SIGN_OUT,
        command: () => this.logout()
      }
    ];
  }

  gotoLogin() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.router.navigate(['/account/login'], { queryParams: { returnUrl: returnUrl } });
  }

  async viewProfile() {
    let profileData: any = {}; 

    this.accountService.getFullProfile().subscribe({
      next: (req) => {
        this.isUpdate = req.status
        profileData = req.data;
      },
      error: (err: HttpErrorResponse) => {
        Swal.fire('Error!', 'Failed to fetch profile details. Please try again.', 'error');
        return;
      }
    });
  
    await new Promise(resolve => setTimeout(resolve, 500)); 
  
    const { value: formValues } = await Swal.fire({
      title: 'Enter Address Details',
      html: `
        <textarea id="swal-input1" class="swal2-textarea" placeholder="Full Address" rows="3">${profileData.fullAddress || ''}</textarea>
        <input id="swal-input2" class="swal2-input" placeholder="District" value="${profileData.district || ''}">
        <input id="swal-input3" class="swal2-input" placeholder="Amphoe" value="${profileData.amphoe || ''}">
        <input id="swal-input4" class="swal2-input" placeholder="Province" value="${profileData.province || ''}">
        <input id="swal-input5" class="swal2-input" placeholder="Zip Code" value="${profileData.zipCode || ''}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {
          FullAddress: (document.getElementById('swal-input1') as HTMLInputElement).value,
          District: (document.getElementById('swal-input2') as HTMLInputElement).value,
          Amphoe: (document.getElementById('swal-input3') as HTMLInputElement).value,
          Province: (document.getElementById('swal-input4') as HTMLInputElement).value,
          ZipCode: (document.getElementById('swal-input5') as HTMLInputElement).value
        };
      }
    });

    if (!formValues) {
      return;
    }
  
    const address: { FullAddress: string; District: string; Amphoe: string; Province: string; ZipCode: string } = formValues;
    if (!address.FullAddress || !address.District || !address.Amphoe || !address.Province || !address.ZipCode) {
      Swal.fire('Error', 'Please fill in all the fields!', 'error');
      return;
    }
    
    if(this.isUpdate){
      this.accountService.updateFullProfile(address).subscribe({
        next: () => {
          Swal.fire('Success!', 'Profile updated successfully!', 'success');
        },
        error: (err: HttpErrorResponse) => {
          Swal.fire('Error!', 'Failed to update profile. Please try again.', 'error');
        }
      });
    }else{
      this.accountService.saveFullProfile(address).subscribe({
        next: () => {
          Swal.fire('Success!', 'Profile updated successfully!', 'success');
        },
        error: (err: HttpErrorResponse) => {
          Swal.fire('Error!', 'Failed to update profile. Please try again.', 'error');
        }
      });
    }
  }
  

  private logout() {
    this.confirmService.confirm({
      header: 'Log Out',
      message: 'Are you sure you want to log out?',
      defaultFocus: 'reject',
      accept: () => {
        this.accountService.logout().subscribe({
          next: (_) => {
            this.logoutUser();
          },
          error: (err: HttpErrorResponse) => {
            if (!environment.production) {
              console.log(err);
            }
            this.logoutUser();
          }
        });
      }
    });
  }

  private logoutUser() {
    localStorage.removeItem(authKey.accessToken);
    localStorage.removeItem(authKey.refreshToken);

    this.accountService.notifyAuthChange(false);

    this.router.navigate(['/']);
  }

}
