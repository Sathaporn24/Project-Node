import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

export interface ItemsCategory{
    id: number
    cateName: string
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) { }

  getCategoryAll(): Observable<ItemsCategory[]> {
    const url = `${environment.apiBaseUrl}/Category`;
    return this.http.get<ItemsCategory[]>(url);
  }

  addCategory(categoryName: string): Observable<ItemsCategory> {
    const url = `${environment.apiBaseUrl}/Category/CreateCategory`;
    return this.http.post<ItemsCategory>(url, { cateName: categoryName });
  }

  editCategory(id: number, categoryName: string): Observable<ItemsCategory> {
    const url = `${environment.apiBaseUrl}/Category/UpdateCategory/${id}`;
    return this.http.put<ItemsCategory>(url, { cateName: categoryName });
  }

  delCategory(id: number): Observable<ItemsCategory> {
    const url = `${environment.apiBaseUrl}/Category/DeleteCategory/${id}`;
    return this.http.delete<ItemsCategory>(url);
  }
}
