import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

export interface ItemsUnit{
    id: number
    unName: string
}

@Injectable({
  providedIn: 'root'
})

export class UnitService {
  constructor(private http: HttpClient) { }

  getUnitAll(): Observable<ItemsUnit[]> {
    const url = `${environment.apiBaseUrl}/Unit`;
    return this.http.get<ItemsUnit[]>(url);
  }

  addUnit(unitName: string): Observable<ItemsUnit> {
    const url = `${environment.apiBaseUrl}/Unit/CreateUnits`;
    return this.http.post<ItemsUnit>(url, { unName: unitName });
  }

  editUnit(id: number, unitName: string): Observable<ItemsUnit> {
    const url = `${environment.apiBaseUrl}/Unit/UpdateUnits/${id}`;
    return this.http.put<ItemsUnit>(url, { unName: unitName });
  }

  delUnit(id: number): Observable<ItemsUnit> {
    const url = `${environment.apiBaseUrl}/Unit/DeleteUnits/${id}`;
    return this.http.delete<ItemsUnit>(url);
  }
}
