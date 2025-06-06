import { Component, OnInit } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";

import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { AccountService } from './shared/services/account.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ToastModule,
    ConfirmDialogModule,
    SweetAlert2Module
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [
    MessageService,
    ConfirmationService
  ]
})
export class AppComponent implements OnInit {
  constructor(private primengConfig: PrimeNGConfig, private accountService: AccountService) { }

  async ngOnInit() {
    this.primengConfig.ripple = true;

    const res = await this.accountService.isUserAuthenticated();
    this.accountService.notifyAuthChange(res);
  }


}
