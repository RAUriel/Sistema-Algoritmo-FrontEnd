import { Component, OnInit } from '@angular/core';
import { KmeansService } from '../../../services/kmeans.service';
import { Chart, registerables } from 'chart.js';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

Chart.register(...registerables);

interface ScatterPoint {
  x: number;
  y: number;
}

@Component({
  selector: 'app-kmeans',
  templateUrl: './kmeans.component.html',
  styleUrls: ['./kmeans.component.css']
})
export class KmeansComponent implements OnInit {
  fileError: string | null = null;
  data: any[][] = [];
  columns: string[] = [];
  file: File | null = null;
  classificationResult: string | null = null;
  kmeansChart: Chart | null = null; // Para almacenar la instancia del gráfico

  constructor(private kmeansService: KmeansService) { }

  ngOnInit(): void {
    // Inicializar o cargar cualquier dato necesario si es necesario
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
          this.data.shift(); // Eliminar la fila de encabezado
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

    this.kmeansService.clasificarRespuestas(respuestas).subscribe({
      next: (result) => {
        console.log("Resultado de la clasificación:", result);

        if (Array.isArray(result.tiposAprendizaje) && result.tiposAprendizaje.every(item => typeof item === 'string')) {
          this.classificationResult = result.tiposAprendizaje.join(', ') || 'desconocido';
        } else {
          this.classificationResult = 'Error en el resultado';
        }

        Swal.fire({
          icon: 'success',
          title: 'Clasificación realizada',
          text: 'Los datos han sido clasificados exitosamente.'
        });

        // Mostrar gráfico con resultados
        this.createChart(result as { tiposAprendizaje: string[] }); // Aseguramos que el tipo sea correcto
      },
      error: (err) => {
        console.log(err);
        this.classificationResult = 'Error en la clasificación';
      }
    });
  }

  private createChart(result: { tiposAprendizaje: string[] }): void {
    const visualPoints = this.generateGaussianPoints(10, [0, -1], 1);
    const auditivoPoints = this.generateGaussianPoints(10, [-1, 0.5], 1);
    const kinestesicoPoints = this.generateGaussianPoints(10, [1, 1], 1);

    const data = [
      ...visualPoints.map(point => ({ x: point[0], y: point[1], cluster: 'Visual' })),
      ...auditivoPoints.map(point => ({ x: point[0], y: point[1], cluster: 'Auditivo' })),
      ...kinestesicoPoints.map(point => ({ x: point[0], y: point[1], cluster: 'Kinestésico' }))
    ];

    const ctx = (document.getElementById('kmeansChart') as HTMLCanvasElement).getContext('2d');
    if (!ctx) return;

    const clusterLabels = ['Visual', 'Auditivo', 'Kinestésico'];
    const colors = ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)'];

    // Crear datos para el gráfico
    const dataset = clusterLabels.map((label, index) => ({
      label: `Cluster ${label}`,
      data: data.filter(point => point.cluster === label),
      backgroundColor: colors[index],
      borderColor: colors[index],
      borderWidth: 1,
      pointRadius: 5,
      pointBackgroundColor: colors[index],
      pointBorderColor: 'rgba(0, 0, 0, 1)',
    }));

    // Si ya existe un gráfico, destrúyelo antes de crear uno nuevo
    if (this.kmeansChart) {
      this.kmeansChart.destroy();
    }

    this.kmeansChart = new Chart(ctx, {
      type: 'scatter', // Tipo de gráfico
      data: {
        datasets: dataset
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const x = (tooltipItem.raw as ScatterPoint).x.toFixed(2);
                const y = (tooltipItem.raw as ScatterPoint).y.toFixed(2);
                return `(${x}, ${y})`;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: false,
            ticks: {
              callback: (value) => value.toString()
            }
          },
          y: {
            beginAtZero: false,
            ticks: {
              callback: (value) => value.toString()
            }
          }
        }
      }
    });
  }

  private generateGaussianPoints(numPoints: number, center: number[], spread: number): number[][] {
    const points: number[][] = [];
    for (let i = 0; i < numPoints; i++) {
      const x = center[0] + (Math.random() - 0.5) * spread;
      const y = center[1] + (Math.random() - 0.5) * spread;
      points.push([x, y]);
    }
    return points;
  }

  downloadChartAsPDF(): void {
    const canvas = document.getElementById('kmeansChart') as HTMLCanvasElement;
    if (!canvas) {
      Swal.fire({
        icon: 'warning',
        title: 'Error',
        text: 'No se encontró el gráfico para descargar.'
      });
      return;
    }

    html2canvas(canvas).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 150);
      pdf.save('kmeans-chart.pdf');
    }).catch((error) => {
      console.error('Error al generar el PDF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo generar el PDF del gráfico.'
      });
    });
  }


}




/*import { Component, OnInit } from '@angular/core';
import { KmeansService } from '../../../services/kmeans.service';
import { Chart, registerables } from 'chart.js';
import * as XLSX from 'xlsx'; // Para leer archivos Excel
import Swal from 'sweetalert2';

Chart.register(...registerables);

@Component({
  selector: 'app-kmeans',
  templateUrl: './kmeans.component.html',
  styleUrls: ['./kmeans.component.css']
})
export class KmeansComponent implements OnInit {
  fileError: string | null = null;
  data: any[][] = [];
  columns: string[] = [];
  file: File | null = null;
  classificationResult: string | null = null;
  kmeansChart: Chart | null = null; // Para almacenar la instancia del gráfico

  constructor(private kmeansService: KmeansService) { }

  ngOnInit(): void {
    // Inicializar o cargar cualquier dato necesario si es necesario
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
          this.data.shift(); // Eliminar la fila de encabezado
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

    this.kmeansService.clasificarRespuestas(respuestas).subscribe({
      next: (result) => {
        console.log("Resultado de la clasificación:", result);

        if (Array.isArray(result.tiposAprendizaje) && result.tiposAprendizaje.every(item => typeof item === 'string')) {
          this.classificationResult = result.tiposAprendizaje.join(', ') || 'desconocido';
        } else {
          this.classificationResult = 'Error en el resultado';
        }

        Swal.fire({
          icon: 'success',
          title: 'Clasificación realizada',
          text: 'Los datos han sido clasificados exitosamente.'
        });

        // Mostrar gráfico con resultados
        this.createChart(result as { tiposAprendizaje: string[] }); // Aseguramos que el tipo sea correcto
      },
      error: (err) => {
        console.log(err);
        this.classificationResult = 'Error en la clasificación';
      }
    });
  }

  private createChart(result: { tiposAprendizaje: string[] }): void {
    const ctx = (document.getElementById('kmeansChart') as HTMLCanvasElement).getContext('2d');
    if (!ctx) return;

    // Ajustar datos para el gráfico
    const clusterLabels: string[] = ['visual', 'auditivo', 'kinestésico']; // Asegura que todos los clusters estén representados
    const clusterData = this.calculateClusterData(result, clusterLabels);

    const data = {
      labels: clusterLabels,
      datasets: [{
        label: 'Número de Puntos por Cluster',
        data: clusterData,
        backgroundColor: clusterLabels.map((label, index) => this.getClusterColor(label)),
        borderColor: clusterLabels.map((label, index) => this.getClusterColor(label, true)),
        borderWidth: 1,
        pointRadius: 5, // Tamaño de los puntos
        pointBackgroundColor: 'rgba(255, 255, 255, 1)', // Color de fondo de los puntos
        pointBorderColor: 'rgba(0, 0, 0, 1)', // Color del borde de los puntos
      }]
    };

    // Si ya existe un gráfico, destrúyelo antes de crear uno nuevo
    if (this.kmeansChart) {
      this.kmeansChart.destroy();
    }

    this.kmeansChart = new Chart(ctx, {
      type: 'bar', // Tipo de gráfico
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false, // Permite ajustar el tamaño del gráfico al contenedor
        plugins: {
          legend: {
            display: true
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                return `${tooltipItem.label}: ${tooltipItem.raw}`;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              autoSkip: false // Muestra todas las etiquetas en el eje x
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => value.toString()
            }
          }
        }
      }
    });
  }

  private calculateClusterData(result: { tiposAprendizaje: string[] }, labels: string[]): number[] {
    const clusterCounts: { [key: string]: number } = {};
    result.tiposAprendizaje.forEach((tipo: string) => {
      clusterCounts[tipo] = (clusterCounts[tipo] || 0) + 1;
    });
    // Ajustar el cálculo según los clusters que tengas
    return labels.map(label => clusterCounts[label] || 0);
  }

  private getClusterColor(label: string, border: boolean = false): string {
    // Asigna un color a cada cluster
    const colors: { [key: string]: string } = {
      'visual': 'rgba(255, 99, 132', // Color para el cluster visual
      'auditivo': 'rgba(54, 162, 235', // Color para el cluster auditivo
      'kinestésico': 'rgba(255, 206, 86' // Color para el cluster kinestésico
    };
    return border ? `${colors[label]}, 1)` : `${colors[label]}, 0.2)`;
  }
}
*/