import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KmeansService {

  private apiUrl: string = 'http://localhost:3500/kmeans'; // Asegúrate de que esta URL coincida con la de tu servidor

  constructor(private http: HttpClient) { }

  // Método para cargar el archivo y entrenar el modelo K-means
  cargarArchivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(`${this.apiUrl}/cargarArchivo`, formData);
  }

  // Método para clasificar respuestas
  clasificarRespuestas(respuestas: number[][]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/clasificarRespuestas`, { respuestas });
  }

  entrenarNuevoModelo(trainingData: number[][], numClusters: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/entrenarmodelo`, { trainingData, numClusters });
  }
}
