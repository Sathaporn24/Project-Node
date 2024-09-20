import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { environment } from '../../../environments/environment.development';
import { LoginUserDto } from '../dtos/login-user.dto';
import { TokenResultDto } from '../dtos/token-result.dto';
import { JwtHelperService } from '@auth0/angular-jwt';
import { firstValueFrom, Subject } from 'rxjs';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { ForgotPasswordDTO } from '../dtos/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';

export const authKey = {
  accessToken: 'auth.jwt:' + location.origin,
  refreshToken: 'auth.rt:' + location.origin
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private authChangeSub = new Subject<boolean>();

  authChanged = this.authChangeSub.asObservable();

  constructor(private http: HttpClient, private jwtHelperService: JwtHelperService) { }

  register(request: RegisterUserDto) {
    let reqUrl = environment.apiBaseUrl + '/accounts/register';
    return this.http.post<unknown>(reqUrl, request);
  }

  login(request: LoginUserDto) {
    let reqUrl = environment.apiBaseUrl + '/accounts/login';
    return this.http.post<TokenResultDto>(reqUrl, request);
  }

  logout() {
    let reqUrl = environment.apiBaseUrl + '/accounts/token/revoke';
    return this.http.post<unknown>(reqUrl, {});
  }

  refresh() {
    let reqUrl = environment.apiBaseUrl + '/accounts/token/refresh';
    const req: RefreshTokenDto = {
      accessToken: localStorage.getItem(authKey.accessToken)!,
      refreshToken: localStorage.getItem(authKey.refreshToken)!
    };

    return this.http.post<TokenResultDto>(reqUrl, req);
  }

  forgotPassword(request: ForgotPasswordDTO) {
    let reqUrl = environment.apiBaseUrl + '/accounts/forgotpassword';
    return this.http.post<unknown>(reqUrl, request);
  }

  resetPassword(request: ResetPasswordDto) {
    let reqUrl = environment.apiBaseUrl + '/accounts/resetpassword';
    return this.http.post<unknown>(reqUrl, request);
  }

  notifyAuthChange(isAuthenticated: boolean) {
    this.authChangeSub.next(isAuthenticated);
  }

  async isUserAuthenticated() {
    const accessToken = localStorage.getItem(authKey.accessToken);

    if (!accessToken) {
      return false;
    }

    if (!this.jwtHelperService.isTokenExpired(accessToken)) {
      return true;
    }

    // try to refresh token
    try {
      const res = await firstValueFrom<TokenResultDto>(this.refresh());

      localStorage.setItem(authKey.accessToken, res.accessToken!);
      localStorage.setItem(authKey.refreshToken, res.refreshToken!);

      return true;
    }
    catch (err) {
      if (!environment.production) {
        console.log(err);
      }
    }

    localStorage.removeItem(authKey.accessToken);
    localStorage.removeItem(authKey.refreshToken);

    return false;
  }

  isUserInRole(role: string) {
    const token = localStorage.getItem(authKey.accessToken);
    if (token) {
      const decodeToken = this.jwtHelperService.decodeToken(token);
      const currentRole = decodeToken['role'];
      if (currentRole && currentRole instanceof Array) {
        return currentRole.findIndex(r => r === role) >= 0;
      }
      return currentRole === role;
    }
    return false;
  }

  getUserFullName() {
    const token = localStorage.getItem(authKey.accessToken);
    if (token) {
      const decodeToken = this.jwtHelperService.decodeToken(token);
      return decodeToken['name'];
    }
    return 'n/a';
  }

}