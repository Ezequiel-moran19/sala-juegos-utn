import { Injectable } from '@angular/core';
import { Tablero } from '../../../interfaces/juegos/sudoku/sudoku.interface';
import { TABLEROS } from '../../../data/sudoku-tableros';
import { SOLUCION } from '../../../data/sudoku-solucion';

@Injectable({
  providedIn: 'root'
})
export class SudokuService {

  private readonly TAMANIO = 6;
  private readonly solucion = SOLUCION;
  private readonly tableros = TABLEROS;

  private tableroActual!: {
    nombre: string;
    celdasFijas: number[][];
  };

  generarTablero(): Tablero {

    const indiceRandom = Math.floor(Math.random() * this.tableros.length);
    this.tableroActual = this.tableros[indiceRandom];
    const tablero = this.crearTableroInicial(this.tableroActual.celdasFijas);

    return tablero.map(fila =>
      fila.map(valor => ({
        valor,
        fijo: valor !== null,
        error: false,
        completado: false
      }))
    );
  }

  private crearTableroInicial(celdasFijas: number[][]): (number | null)[][] {
    const tablero = Array.from({ length: this.TAMANIO }, () => Array(this.TAMANIO).fill(null));
    for (const [fila, columna] of celdasFijas) {
      tablero[fila][columna] = this.solucion[fila][columna];
    }
    return tablero;
  }

  getNombreTablero(): string {
    return this.tableroActual?.nombre ?? 'Sudoku';
  }

  validarMovimiento(fila: number, columna: number, numero: number): boolean {
    return this.solucion[fila][columna] === numero;
  }

  tableroCompleto(tablero: Tablero): boolean {
    return tablero.every((fila, i) => fila.every((celda, j) => celda.valor === this.solucion[i][j]));
  }

  verificarNumeroCompleto(tablero: Tablero, numero: number): boolean {
    let cantidad = 0;
    for (const fila of tablero) {
      for (const celda of fila) {
        if (celda.valor === numero) {
          cantidad++;
        }
      }
    }
    return cantidad === this.TAMANIO;
  }

}