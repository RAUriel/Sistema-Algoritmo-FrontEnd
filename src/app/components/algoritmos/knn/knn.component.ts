import { Component, OnInit } from '@angular/core';
import { KnnService } from '../../../services/knn.service';
import { Chart, registerables, TooltipItem } from 'chart.js';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

Chart.register(...registerables);

@Component({
  selector: 'app-knn',
  templateUrl: './knn.component.html',
  styleUrls: ['./knn.component.css']
})
export class KnnComponent implements OnInit {
  fileError: string | null = null;
  data: any[][] = [];
  columns: string[] = [];
  file: File | null = null;
  classificationResult: string | null = null;
  scatterChart: any;

  constructor(private knnService: KnnService) { }

  ngOnInit(): void {
    // Initialize or load any required data if needed
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];

    if (file) {
      // Validar tipo de archivo
      const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      if (!validTypes.includes(file.type)) {
        this.fileError = 'Solo se permiten archivos Excel.';
        event.target.value = ''; // Limpiar el campo de entrada
        this.file = null;
        this.data = [];
        this.columns = [];
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
          this.columns = this.data[0];
          this.data.shift(); // Remove the header row
        }
      };
      reader.readAsBinaryString(this.file);
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

    const respuestas = this.data.map(row => row.map(cell => Number(cell)));
    console.log("El contenido del Excel para clasificar es el siguiente: ", respuestas);

    this.knnService.clasificarRespuestas(respuestas).subscribe({
      next: (result) => {
        console.log("Resultado de la clasificación:", result);

        if (Array.isArray(result.tiposAprendizaje)) {
          this.classificationResult = result.tiposAprendizaje[0] || 'desconocido';
        } else {
          this.classificationResult = 'Error en el resultado';
        }

        // Mostrar gráfico con resultados
        this.createChart(respuestas, result);

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

  private createChart(respuestas: number[][], result: any): void {
    // Datos de ejemplo para las tres clases
    const visualPoints = [
      [1, 1], [1.2, 1.1], [0.8, 0.9], [1.1, 0.8] // Ajusta los puntos como necesites
    ];
    const auditivoPoints = [
      [2, 2], [2.1, 2.2], [1.9, 2.1], [2.2, 1.9] // Ajusta los puntos como necesites
    ];
    const kinestesicoPoints = [
      [4, 4], [4.1, 4.2], [3.9, 4.1], [4.2, 3.9] // Ajusta los puntos como necesites
    ];

    // Colocar el punto clasificado en las coordenadas de la clase a la que pertenece
    let classifiedPoint: { x: number; y: number } = { x: 0, y: 0 };
    const classification = this.classificationResult?.toLowerCase();
    
    switch (classification) {
      case 'visual':
        classifiedPoint = { x: 1, y: 1 }; // Ajustar según necesidad
        break;
      case 'auditivo':
        classifiedPoint = { x: 2, y: 2 }; // Ajustar según necesidad
        break;
      case 'kinestésico':
        classifiedPoint = { x: 4, y: 4 }; // Ajustar según necesidad
        break;
      default:
        classifiedPoint = { x: 0, y: 0 }; // Default position if unknown
        break;
    }

    // Limpiar gráfico anterior
    this.scatterChart?.destroy();

    this.scatterChart = new Chart('scatterChart', {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Clase Visual',
            data: visualPoints.map(point => ({ x: point[0], y: point[1] })),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            pointRadius: 5, // Tamaño de los puntos
            showLine: false
          },
          {
            label: 'Clase Auditiva',
            data: auditivoPoints.map(point => ({ x: point[0], y: point[1] })),
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            pointRadius: 5, // Tamaño de los puntos
            showLine: false
          },
          {
            label: 'Clase Kinestésico',
            data: kinestesicoPoints.map(point => ({ x: point[0], y: point[1] })),
            backgroundColor: 'rgba(255, 206, 86, 0.6)',
            borderColor: 'rgba(255, 206, 86, 1)',
            pointRadius: 5, // Tamaño de los puntos
            showLine: false
          },
          {
            label: 'Resultado Clasificado',
            data: [classifiedPoint],
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            pointRadius: 10, // Tamaño de los puntos clasificados
            borderWidth: 2, // Ancho del borde del punto clasificado
            showLine: false
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context: TooltipItem<'scatter'>) => {
                const rawData = context.raw as { x: number; y: number };
                return `(${rawData.x}, ${rawData.y})`;
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Eje X' }
          },
          y: {
            title: { display: true, text: 'Eje Y' }
          }
        }
      }
    });
  }

  // Método para generar y descargar el PDF
  downloadPDF(): void {
    const chartElement = document.getElementById('scatterChart');
    if (!chartElement) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró el gráfico para generar el PDF.'
      });
      return;
    }

    html2canvas(chartElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.width;
      const pdfHeight = pdf.internal.pageSize.height;
      const imgWidth = 190; // Ajusta el tamaño de la imagen
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save('grafico-knn.pdf');
    });
  }
}


/*import { Component, OnInit } from '@angular/core';
import { KnnService } from '../../../services/knn.service';
import { Chart, registerables, TooltipItem } from 'chart.js';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

Chart.register(...registerables);

@Component({
  selector: 'app-knn',
  templateUrl: './knn.component.html',
  styleUrls: ['./knn.component.css']
})
export class KnnComponent implements OnInit {
  data: any[][] = [];
  columns: string[] = [];
  file: File | null = null;
  classificationResult: string | null = null;
  scatterChart: any;

  constructor(private knnService: KnnService) { }

  ngOnInit(): void {
    // Initialize or load any required data if needed
  }

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

  clasificar(): void {
    if (!this.file) {
      Swal.fire({
        icon: 'warning',
        title: 'No hay archivo cargado',
        text: 'Por favor, cargue un archivo Excel antes de intentar clasificar.'
      });
      return;
    }

    const respuestas = this.data.map(row => row.map(cell => Number(cell)));
    console.log("El contenido del Excel para clasificar es el siguiente: ", respuestas);

    this.knnService.clasificarRespuestas(respuestas).subscribe({
      next: (result) => {
        console.log("Resultado de la clasificación:", result);

        if (Array.isArray(result.tiposAprendizaje)) {
          this.classificationResult = result.tiposAprendizaje[0] || 'desconocido';
        } else {
          this.classificationResult = 'Error en el resultado';
        }

        // Mostrar gráfico con resultados
        this.createChart(respuestas, result);

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

  private createChart(respuestas: number[][], result: any): void {
    // Datos de ejemplo para las tres clases
    const visualPoints = [
      [1, 1], [1.2, 1.1], [0.8, 0.9], [1.1, 0.8] // Ajusta los puntos como necesites
    ];
    const auditivoPoints = [
      [2, 2], [2.1, 2.2], [1.9, 2.1], [2.2, 1.9] // Ajusta los puntos como necesites
    ];
    const kinestesicoPoints = [
      [4, 4], [4.1, 4.2], [3.9, 4.1], [4.2, 3.9] // Ajusta los puntos como necesites
    ];

    // Colocar el punto clasificado en las coordenadas de la clase a la que pertenece
    let classifiedPoint: { x: number; y: number } = { x: 0, y: 0 };
    const classification = this.classificationResult?.toLowerCase();
    
    switch (classification) {
      case 'visual':
        classifiedPoint = { x: 1, y: 1 }; // Ajustar según necesidad
        break;
      case 'auditivo':
        classifiedPoint = { x: 2, y: 2 }; // Ajustar según necesidad
        break;
      case 'kinestésico':
        classifiedPoint = { x: 4, y: 4 }; // Ajustar según necesidad
        break;
      default:
        classifiedPoint = { x: 0, y: 0 }; // Default position if unknown
        break;
    }

    // Limpiar gráfico anterior
    this.scatterChart?.destroy();

    this.scatterChart = new Chart('scatterChart', {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Puntos Visual',
            data: visualPoints.map(point => ({ x: point[0], y: point[1] })),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            pointRadius: 5, // Tamaño de los puntos
            showLine: false
          },
          {
            label: 'Puntos Auditivo',
            data: auditivoPoints.map(point => ({ x: point[0], y: point[1] })),
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            pointRadius: 5, // Tamaño de los puntos
            showLine: false
          },
          {
            label: 'Puntos Kinestésico',
            data: kinestesicoPoints.map(point => ({ x: point[0], y: point[1] })),
            backgroundColor: 'rgba(255, 206, 86, 0.6)',
            borderColor: 'rgba(255, 206, 86, 1)',
            pointRadius: 5, // Tamaño de los puntos
            showLine: false
          },
          {
            label: 'Punto Clasificado',
            data: [classifiedPoint],
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            pointRadius: 10, // Tamaño de los puntos clasificados
            borderWidth: 2, // Ancho del borde del punto clasificado
            showLine: false
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context: TooltipItem<'scatter'>) => {
                const rawData = context.raw as { x: number; y: number };
                return `(${rawData.x}, ${rawData.y})`;
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Eje X' }
          },
          y: {
            title: { display: true, text: 'Eje Y' }
          }
        }
      }
    });
  }
}

*/