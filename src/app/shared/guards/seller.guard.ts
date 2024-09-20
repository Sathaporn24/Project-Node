import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';

export const sellerGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  const res = accountService.isUserInRole('Seller');

  if (!res) {
    router.navigate(['/forbidden'], { queryParams: { returnUrl: state.url } });
  }

  return res;
};
