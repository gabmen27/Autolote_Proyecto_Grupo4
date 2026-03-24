import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  private apiUrl = 'http://localhost:3000/api/tipo-cambio';

  constructor(private http: HttpClient) {}

  getExchangeRates(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of({ error: 'No token available' });
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(this.apiUrl, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching exchange rates:', error);
        return of({ error: 'Cargando tasas de cambio...' });
      })
    );
  }
}