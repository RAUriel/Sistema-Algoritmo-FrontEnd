/*import { Component, OnInit } from '@angular/core';
import { KmeansService } from '../services/kmeans.service'; // Ajusta la ruta si es necesario
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-entrenar-kmeans',
  templateUrl: './entrenar-kmeans.component.html',
  styleUrls: ['./entrenar-kmeans.component.css']
})
export class EntrenarKmeansComponent implements OnInit {
  file: File | null = null;
  fileError: string | null = null;
  data: any[][] = [];
  numClusters: number = 3;

  constructor(private kmeansService: KmeansService) { }

  ngOnInit(): void { }

  onFileChange(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      if (!validTypes.includes(file.type)) {
        this.fileError = 'Solo se permiten archivos Excel.';
        event.target.value = '';
        this.file = null;
        this.data = [];
        return;
      }

      this.fileError = null;
      this.file = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const wb = XLSX.read(e.target.result, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        this.data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        if (this.data.length > 0) {
          this.data.shift(); // Eliminar la fila de encabezado si existe
        }
      };
      reader.readAsBinaryString(this.file);
    }
  }

  entrenarModelo(): void {
    if (!this.file) {
      Swal.fire({
        icon: 'warning',
        title: 'No hay archivo cargado',
        text: 'Por favor, cargue un archivo Excel antes de intentar entrenar el modelo.'
      });
      return;
    }

    const trainingData = this.data.map(row => row.map(cell => Number(cell)));

    this.kmeansService.entrenarNuevoModelo(trainingData, this.numClusters)
      .subscribe({
        next: (result) => {
          console.log("Modelo entrenado exitosamente:", result);
          Swal.fire({
            icon: 'success',
            title: 'Modelo entrenado',
            text: 'El nuevo modelo k-means ha sido entrenado y guardado.'
          });
        },
        error: (err) => {
          console.error("Error al entrenar el modelo:", err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al entrenar el modelo. Por favor, inténtalo de nuevo.'
          });
        }
      });
  }
}*/
import { Component, OnInit } from '@angular/core';
import { KmeansService } from '../services/kmeans.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-entrenar-kmeans',
  templateUrl: './entrenar-kmeans.component.html',
  styleUrls: ['./entrenar-kmeans.component.css']
})
export class EntrenarKmeansComponent implements OnInit {
  file: File | null = null;
  fileError: string | null = null;
  data: any[][] = [];
  numClusters: number = 3;

  constructor(private kmeansService: KmeansService) { }

  ngOnInit(): void { }

  onFileChange(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      if (!validTypes.includes(file.type)) {
        this.fileError = 'Solo se permiten archivos Excel.';
        event.target.value = '';
        this.file = null;
        this.data = [];
        return;
      }

      this.fileError = null;
      this.file = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const wb = XLSX.read(e.target.result, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        this.data = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (this.data.length > 0) {
          this.data.shift(); // Eliminar la fila de encabezado si existe
        }

        // Convertir datos a números y filtrar filas vacías
        this.data = this.data
          .map(row => row.map(cell => Number(cell)).filter(cell => !isNaN(cell)))
          .filter(row => row.length > 0); // Filtrar filas vacías
      };
      reader.readAsBinaryString(this.file);
    }
  }

  entrenarModelo(): void {
    if (!this.file) {
      Swal.fire({
        icon: 'warning',
        title: 'No hay archivo cargado',
        text: 'Por favor, cargue un archivo Excel antes de intentar entrenar el modelo.'
      });
      return;
    }

    const trainingData = this.data;

    this.kmeansService.entrenarNuevoModelo(trainingData, this.numClusters)
      .subscribe({
        next: (result) => {
          console.log("Modelo entrenado exitosamente:", result);
          Swal.fire({
            icon: 'success',
            title: 'Modelo entrenado',
            text: 'El nuevo modelo k-means ha sido entrenado y guardado.'
          });
        },
        error: (err) => {
          console.error("Error al entrenar el modelo:", err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al entrenar el modelo. Por favor, inténtalo de nuevo.'
          });
        }
      });
  }
}
