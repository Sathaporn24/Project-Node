import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  const res = await accountService.isUserAuthenticated();

  if (!res) {
    router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
  }

  return res;
};
