import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { KnnService } from '../../../services/knn.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-knn',
  templateUrl: './knn.component.html',
  styleUrls: ['./knn.component.css']
})
export class KnnComponent {
  data: any[][] = [];
  columns: string[] = [];
  file: File | null = null;
  classificationResult: string | null = null;

  constructor(private knnService: KnnService) { }

  onFileChange(event: any): void {
    this.file = event.target.files[0];
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const wb = XLSX.read(e.target.result, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        this.data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        if (this.data.length > 0) {
          this.columns = this.data[0];
          this.data.shift(); // Remove the header row
        }
      };
      reader.readAsBinaryString(this.file);
    }
  }

  private mapearTipoAprendizaje(valor: number): string {
    switch (valor) {
      case 0:
        return 'visual';
      case 1:
        return 'auditivo';
      case 2:
        return 'kinestésico';
      default:
        return 'desconocido';
    }
  }
  
  clasificar(): void {
    if (!this.file) {
      Swal.fire({
        icon: 'warning',
        title: 'No hay archivo cargado',
        text: 'Por favor, cargue un archivo Excel antes de intentar clasificar.'
      });
      return;
    }
  
    // Extraer respuestas (asumimos que los datos están en formato número)
    const respuestas = this.data.map(row => row.map(cell => Number(cell)));
    console.log("El contenido del Excel para clasificar es el siguiente: ", respuestas);
    
    // Llamar al servicio para clasificar las respuestas
    this.knnService.clasificarRespuestas(respuestas).subscribe({
      next: (result) => {
        console.log("Resultado de la clasificación:", result);
  
        // Asegúrate de que result.tiposAprendizaje sea un arreglo
        if (Array.isArray(result.tiposAprendizaje)) {
          // Actualiza classificationResult con el primer elemento de tiposAprendizaje
          this.classificationResult = result.tiposAprendizaje[0] || 'desconocido';
        } else {
          this.classificationResult = 'Error en el resultado';
        }
  
        // Mostrar alerta de éxito
        Swal.fire({
          icon: 'success',
          title: 'Clasificación realizada',
          text: 'Los datos han sido clasificados exitosamente.'
        });
      },
      error: (err) => {
        console.log(err);
        this.classificationResult = 'Error en la clasificación';
      }
    });
  }

}