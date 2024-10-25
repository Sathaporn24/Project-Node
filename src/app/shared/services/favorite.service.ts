import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { authKey } from './account.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  constructor(private http: HttpClient, private jwtHelperService: JwtHelperService) { }

  addFavorites(productId: string) {
    const token = localStorage.getItem(authKey.accessToken);
    if (!token) {
      throw new Error("Token not found");
    }
    const userId = this.jwtHelperService.decodeToken(token)['sub'];
    let reqUrl = environment.apiBaseUrl + '/Favorite/AddFavorite';
    return this.http.post<any>(reqUrl, {userId, productId});
  }

 allFavorite(){
    const token = localStorage.getItem(authKey.accessToken);
    if (!token) {
      throw new Error("Token not found");
    }
    const userId = this.jwtHelperService.decodeToken(token)['sub'];
    let reqUrl = environment.apiBaseUrl + `/Favorite?userId=${userId}`;
    return this.http.get<any>(reqUrl);
 }

 delFavorite(id:string){
    let reqUrl = environment.apiBaseUrl + `/Favorite/RemoveFavorite/${id}`;
    return this.http.delete<any>(reqUrl);
 }
}
