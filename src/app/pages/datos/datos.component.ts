import { Component, OnInit } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.css']
})
export class DatosComponent implements OnInit {
  respuestas: any[] = [];
  filters = {
    visual: true,
    auditivo: true,
    kinestesico: true
  };

  constructor(private datosService: DatosService) { }

  ngOnInit() {
    this.obtenerDatos();
  }

  obtenerDatos(): void {
    this.datosService.obtenerDatos().subscribe(
      data => {
        this.respuestas = data;
        Swal.fire({
          icon: 'success',
          text: 'Existen Datos para su Descarga',
          position: 'top-end',
          toast: true,
          timer: 3000, // Tiempo en milisegundos que durará la alerta antes de desaparecer
          showConfirmButton: false
        });
      },
      error => {
        console.error('Error al obtener los datos', error);
        Swal.fire({
          icon: 'error',
          text: 'No Existen Datos para su Descarga',
          position: 'top-end',
          toast: true,
          timer: 3000, // Tiempo en milisegundos que durará la alerta antes de desaparecer
          showConfirmButton: false
        });
      }
    );
  }

  descargarExcel(): void {
    if (this.respuestas.length === 0) {
      console.error('No hay datos para descargar.');
      return;
    }

    const filtro = Object.keys(this.filters)
      .filter(key => this.filters[key])
      .map(key => {
        switch (key) {
          case 'visual': return 0;
          case 'auditivo': return 1;
          case 'kinestesico': return 2;
          default: return null;
        }
      })
      .filter((value): value is 0 | 1 | 2 => value !== null);

    // Filtrar las respuestas según el filtro
    const filteredData = this.respuestas.filter(respuesta =>
      Object.values(respuesta).every((value: any) => filtro.includes(value as 0 | 1 | 2))
    );

    const columns = [
      'Pregunta 1', 'Pregunta 2', 'Pregunta 3', 'Pregunta 4', 'Pregunta 5',
      'Pregunta 6', 'Pregunta 7', 'Pregunta 8', 'Pregunta 9', 'Pregunta 10'
    ];

    const data = filteredData.map(respuesta => [
      respuesta.respuesta1, respuesta.respuesta2, respuesta.respuesta3, respuesta.respuesta4,
      respuesta.respuesta5, respuesta.respuesta6, respuesta.respuesta7, respuesta.respuesta8,
      respuesta.respuesta9, respuesta.respuesta10
    ]);

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([columns, ...data]);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Respuestas');

    XLSX.writeFile(wb, 'respuestas.xlsx');
  }
}
