import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KnnService {
  private apiUrl = 'http://localhost:3500/algoritmo'; // URL de tu endpoint backend

  constructor(private http: HttpClient) { }

  cargarArchivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/cargar`, formData);
  }

  clasificarRespuestas(respuestas: number[][]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/knn`, { respuestas });
  }
}