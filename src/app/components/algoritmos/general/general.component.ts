import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent {
  data: any[][] = [];
  columns: string[] = [];
  selectedVariables: string[] = [];
  editableCells: boolean[][] = [];
  fileError: string | null = null;

  constructor(private router: Router) {}

  onFileChange(event: any): void {
    const file = event.target.files[0];

    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (!file || !validTypes.includes(file.type)) {
      this.fileError = 'Solo se permiten archivos Excel.';
      event.target.value = '';
      this.data = [];
      this.columns = [];
      this.fileError = null;
      return;
    }

    this.fileError = null;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const wb = XLSX.read(e.target.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      this.data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (this.data.length > 0) {
        this.columns = this.data[0];
        this.data.shift();
        this.initializeEditableCells();
      }
    };
    reader.readAsBinaryString(file);
  }

  onColumnTitleChange(index: number, event: any): void {
    this.columns[index] = event.target.value;
  }

  addColumn(): void {
    const newColumn = `Nueva Columna ${this.columns.length + 1}`;
    this.columns.push(newColumn);
    this.data.forEach(row => row.push(''));
    this.editableCells.forEach(row => row.push(true));
  }

  removeColumn(index: number): void {
    this.columns.splice(index, 1);
    this.data.forEach(row => row.splice(index, 1));
    this.initializeEditableCells();
  }

  removeRow(index: number): void {
    this.data.splice(index, 1);
    this.initializeEditableCells();
  }

  initializeEditableCells(): void {
    this.editableCells = this.data.map(row => new Array(this.columns.length).fill(true));
  }

  updateCellValue(value: any, rowIndex: number, colIndex: number): void {
    this.data[rowIndex][colIndex] = value;
  }

  validateCellValue(rowIndex: number, colIndex: number): void {
    const value = this.data[rowIndex][colIndex];
    if (!/^[0-2]$/.test(value)) {
      this.data[rowIndex][colIndex] = '';
      Swal.fire({
        icon: 'error',
        title: 'Valor no permitido',
        text: 'Solo se permiten los valores 0, 1 y 2.',
      });
    }
  }

  onVariableSelect(event: any, column: string): void {
    if (event.target.checked) {
      this.selectedVariables.push(column);
    } else {
      this.selectedVariables = this.selectedVariables.filter(varName => varName !== column);
    }
  }

  descargarExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([this.columns, ...this.data]);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');

    XLSX.writeFile(wb, 'Datos_Modificados.xlsx');

    Swal.fire({
      title: '¿Deseas continuar?',
      text: 'A continuación serás redirigido a la página para realizar la evaluación.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Selecciona el método de evaluación',
          text: '¿Deseas evaluar con KNN o con KMEANS?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'KNN',
          cancelButtonText: 'KMEANS'
        }).then((methodResult) => {
          if (methodResult.isConfirmed) {
            this.router.navigate(['/knn']);
          } else if (methodResult.dismiss === Swal.DismissReason.cancel) {
            this.router.navigate(['/kmeans']);
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'La redirección ha sido cancelada.',
          'error'
        );
      }
    });
  }
}


/*
import { Component } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent {
  data: any[][] = [];
  columns: string[] = [];
  selectedVariables: string[] = [];
  editableCells: boolean[][] = [];

  onFileChange(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const wb = XLSX.read(e.target.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      this.data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (this.data.length > 0) {
        this.columns = this.data[0];
        this.data.shift();
        this.initializeEditableCells();
      }
    };
    reader.readAsBinaryString(file);
  }

  onColumnTitleChange(index: number, event: any): void {
    this.columns[index] = event.target.value;
  }

  addColumn(): void {
    const newColumn = `Nueva Columna ${this.columns.length + 1}`;
    this.columns.push(newColumn);
    this.data.forEach(row => row.push(''));
    this.initializeEditableCells();
  }

  removeColumn(index: number): void {
    this.columns.splice(index, 1);
    this.data.forEach(row => row.splice(index, 1));
    this.initializeEditableCells();
  }

  removeRow(index: number): void {
    this.data.splice(index, 1);
    this.initializeEditableCells();
  }

  initializeEditableCells(): void {
    this.editableCells = this.data.map(() => new Array(this.columns.length).fill(false));
  }

  onVariableSelect(event: any, column: string): void {
    if (event.target.checked) {
      this.selectedVariables.push(column);
    } else {
      this.selectedVariables = this.selectedVariables.filter(varName => varName !== column);
    }
  }
}
*/