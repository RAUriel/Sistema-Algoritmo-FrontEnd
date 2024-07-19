import { Component } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrl: './datos.component.css'
})
export class DatosComponent {
  respuestas: any[] = [];

  constructor(private datosService: DatosService) { }

  obtenerDatos(): void {
    this.datosService.obtenerDatos().subscribe(
      data => {
        this.respuestas = data;
        console.log(data);
  
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
    // Verificar si respuestas no está vacío
    if (this.respuestas.length === 0) {
      console.error('No hay datos para descargar.');
      return;
    }
  
    // Define las columnas del archivo Excel
    const columns = [
      '¿Cuál de los siguientes métodos prefieres para aprender algo nuevo?', 'Cuando estudias, ¿qué tipo de material te resulta más efectivo?', '¿Cómo te sientes más cómodo al recordar información?', 'En una clase, ¿qué tipo de actividad te ayuda a entender mejor el contenido?', 'Si tienes que ensamblar un mueble, ¿cómo prefieres seguir las instrucciones?', 
      '¿Qué tipo de ejercicios prefieres en una clase de educación física?', '¿Cuál es tu método preferido para repasar antes de un examen?', '¿Cómo prefieres aprender a usar un nuevo software o aplicación?', '¿Qué te resulta más fácil recordar después de una conferencia?', '¿Cómo prefieres preparar una receta de cocina?'
    ];
  
    // Estructura los datos para el archivo Excel
    const data = this.respuestas.map(respuesta => [
      respuesta.respuesta1, respuesta.respuesta2, respuesta.respuesta3, respuesta.respuesta4, respuesta.respuesta5,
      respuesta.respuesta6, respuesta.respuesta7, respuesta.respuesta8, respuesta.respuesta9, respuesta.respuesta10
    ]);
  
    // Convierte los datos a un formato adecuado para XLSX
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([columns, ...data]);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Respuestas');
  
    // Genera y descarga el archivo Excel
    XLSX.writeFile(wb, 'respuestas.xlsx');
  }

}
