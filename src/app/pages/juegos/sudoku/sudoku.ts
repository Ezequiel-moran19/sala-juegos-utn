import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SudokuService } from '../../../services/juegos/sudoku/sudoku.service';
import { SudokuDbService } from '../../../services/juegos/sudoku/sudoku-db.service';
import { AuthService } from '../../../services/auth/auth.service';
import { RankingComponent } from '../../../components/ranking/ranking';
import { Tablero } from '../../../interfaces/juegos/sudoku/sudoku.interface';
import { Rankings } from '../../../interfaces/ranking/ranking';
import { PartidaSudoku } from '../../../interfaces/juegos/sudoku/partida-sudoku';

@Component({
  selector: 'app-sudoku',
  standalone: true,
  imports: [CommonModule, RankingComponent, RouterLink],
  templateUrl: './sudoku.html',
  styleUrl: './sudoku.css'
})

export class Sudoku implements OnInit {

  private sudokuService = inject(SudokuService);
  private sudokuDbService = inject(SudokuDbService);
  private authService = inject(AuthService);

  tablero: Tablero = [];
  filaSeleccionada: number | null = null;
  columnaSeleccionada: number | null = null;
  juegoTerminado = false;
  numerosCompletados = new Set<number>();
  movimientos = 0;
  puntos = 0;
  tiempoInicio = 0;
  tiempoActual = '00:00';
  mostrarRanking = false;
  ranking: Rankings[] = [];
  readonly numeros = [1, 2, 3, 4, 5, 6];
  private timerId: any;

  ngOnInit() {
    this.nuevoJuego();
    this.cargarRanking();
  }

  nuevoJuego(): void {
    clearTimeout(this.timerId);
    this.tablero = this.sudokuService.generarTablero();
    this.filaSeleccionada = null;
    this.columnaSeleccionada = null;
    this.juegoTerminado = false;
    this.movimientos = 0;
    this.puntos = 0;
    this.numerosCompletados.clear();
    this.tiempoInicio = Date.now();
    this.actualizarTiempo();
  }

  actualizarTiempo(): void {
    if (this.juegoTerminado) {
      return;
    }

    const segundos = Math.floor((Date.now() - this.tiempoInicio) / 1000);
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;

    this.tiempoActual = `${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`;
    this.timerId = setTimeout(() => this.actualizarTiempo(), 1000);
  }

  seleccionarCelda(fila: number, columna: number): void {

    const celda = this.tablero[fila][columna];
    if (!celda.fijo && !this.juegoTerminado) {
      this.filaSeleccionada = fila;
      this.columnaSeleccionada = columna;
    }
  }

  async ponerNumero(numero: number): Promise<void> {

    if ( this.filaSeleccionada === null ||
        this.columnaSeleccionada === null ||
        this.juegoTerminado ) {
      return;
    }

    const celda = this.tablero[this.filaSeleccionada][this.columnaSeleccionada];

    if (celda.fijo) {
      return;
    }

    this.movimientos++;

    const esValido = this.sudokuService.validarMovimiento(this.filaSeleccionada, this.columnaSeleccionada, numero);

    if (!esValido) {
      celda.error = true;
      this.puntos = Math.max(0, this.puntos - 5);

      setTimeout(() => {
        celda.error = false;
      }, 800);

      return;
    }

    celda.valor = numero;
    celda.error = false;

    this.puntos += 10;
    this.verificarNumeroCompleto(numero);

    if (this.sudokuService.tableroCompleto(this.tablero)) {
      this.juegoTerminado = true;
      this.puntos += 200;
      await this.guardarPartida();
    }
  }

  private verificarNumeroCompleto(numero: number): void {
    const completo = this.sudokuService.verificarNumeroCompleto(this.tablero, numero);

    if (!completo) {
      return;
    }

    this.numerosCompletados.add(numero);
    this.puntos += 50;
    this.resaltarNumero(numero);
  }

  private resaltarNumero(numero: number): void {

    for (const fila of this.tablero) {
      for (const celda of fila) {
        if (celda.valor === numero) {
          celda.completado = true;

          setTimeout(() => {
            celda.completado = false;
          }, 1500);
        }
      }
    }
  }

  limpiarCelda(): void {

    if (this.filaSeleccionada === null ||
        this.columnaSeleccionada === null ||
        this.juegoTerminado) {
      return;
    }

    const celda = this.tablero[this.filaSeleccionada][this.columnaSeleccionada];

    if (celda.fijo) {
      return;
    }

    const valorAnterior = celda.valor;

    celda.valor = null;
    celda.error = false;

    if (valorAnterior && this.numerosCompletados.has(valorAnterior)) {
      this.numerosCompletados.delete(valorAnterior);
    }
    this.movimientos++;
  }

  obtenerCantidadRestante(numero: number): number {

    let cantidad = 0;
    for (const fila of this.tablero) {
      for (const celda of fila) {
        if (celda.valor === numero && !celda.error) {
          cantidad++;
        }
      }
    }
    return 6 - cantidad;
  }

  getNombreTablero(): string {
    return this.sudokuService.getNombreTablero();
  }

  async cargarRanking(): Promise<void> {

    const { data, error } = await this.sudokuDbService.obtenerRanking();
    if (error) {
      console.error(error);
      return;
    }
    this.ranking = data ?? [];
  }

  private async guardarPartida(): Promise<void> {

    const tiempo = Math.floor((Date.now() - this.tiempoInicio) / 1000);
    const partida: PartidaSudoku = {
      usuario: this.authService.usuarioActual()?.email ?? '',
      puntaje: this.puntos,
      movimientos: this.movimientos,
      tiempo,
      gano: true,
      fecha: new Date().toISOString()
    };

    const { error } = await this.sudokuDbService.guardarPartida(partida);

    if (error) {
      console.error(error);
      return;
    }
    await this.cargarRanking();
  }

  mostrarOcultarRanking(): void {
    this.mostrarRanking = !this.mostrarRanking;
  }
}