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
      }
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
