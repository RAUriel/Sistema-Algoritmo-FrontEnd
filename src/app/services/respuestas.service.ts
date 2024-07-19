import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RespuestasService {

  private apiUrl = 'http://localhost:3500/respuestas';

  constructor(private http: HttpClient) { }

  guardarRespuestas(respuestas: number[]): Observable<any> {
    return this.http.post<any>(this.apiUrl, { respuestas });
  }

}
