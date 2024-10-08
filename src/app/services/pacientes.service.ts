import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../enviroment';

@Injectable({
  providedIn: 'root'
})
export class PacientesService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.error('Token não encontrado no localStorage');
      throw new Error('Token de autenticação não encontrado');
    }

    console.log('Token de autenticação usado na requisição:', token);

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getPacientes(query: string = "", pageNumber: number = 0, pageSize: number = 17): Observable<any> {
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());

    if (query) {
      params = params.set('search', query);
    }

    return this.http.get(`${this.apiUrl}/pacientes/active`, { headers: this.getAuthHeaders(), params })
      .pipe(
        catchError(error => {
          console.error('Erro ao carregar pacientes:', error);
          return throwError(() => new Error('Erro ao carregar pacientes'));
        })
      );
  }
}
