import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AhorcadoService } from '../../../services/juegos/ahorcado.service';
import { AuthService } from '../../../services/auth/auth.service';
import { PartidaAhorcado } from '../../../interfaces/juegos/ahorcado/partida-ahorcado';

import { PALABRAS_AHORCADO, ABECEDARIO, MAX_ERRORES } from '../../../data/ahorcado.const';
import { Rankings } from '../../../interfaces/ranking/ranking';
import { Ranking } from "../../../components/ranking/ranking";

@Component({
  selector: 'app-ahorcado',
  imports: [CommonModule, RouterLink, Ranking],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css',
})

export class Ahorcado implements OnInit {

  authService = inject(AuthService);
  ahorcadoService = inject(AhorcadoService);

  readonly palabras = PALABRAS_AHORCADO;
  readonly abecedario = ABECEDARIO;
  readonly maxErrores = MAX_ERRORES;

  palabra = '';
  letrasSeleccionadas: string[] = [];
  errores = 0;
  juegoTerminado = false;
  gano = false;
  tiempoInicio = 0;
  tiempoPartida = 0;
  puntajeFinal = 0;
  mostrarRanking = false;
  tiempoActual = 0;
  ranking: Rankings[] = [];

  async ngOnInit() {
    this.iniciarJuego();
    await this.cargarRanking();
  }

  iniciarJuego() {
    const indice = Math.floor( Math.random() * this.palabras.length );
    this.palabra = this.palabras[indice];
    this.resetEstadoJuego();
  }

  private resetEstadoJuego() {
    this.letrasSeleccionadas = [];
    this.errores = 0;
    this.juegoTerminado = false;
    this.gano = false;
    this.tiempoInicio = Date.now();
    this.tiempoPartida = 0;
    this.tiempoActual = 0;
    this.puntajeFinal = 0;
  }

  seleccionarLetra(letra: string) {
    if (this.juegoTerminado) return;

    this.tiempoActual = this.obtenerTiempoActual();
    this.letrasSeleccionadas.push(letra);

    if (!this.palabra.includes(letra)) {
      this.errores++;
    }

    this.verificarEstadoJuego();
  }

  private verificarEstadoJuego() {
    if (this.palabraCompleta()) {
      this.finalizarJuego(true);
      return;
    }

    if (this.errores >= this.maxErrores) {
      this.finalizarJuego(false);
    }
  }

  private palabraCompleta(): boolean {
    return this.palabra.split('').every(letra =>
        this.letrasSeleccionadas.includes(letra)
      );
  }

  private async finalizarJuego(gano: boolean) {
    this.gano = gano;
    this.juegoTerminado = true;
    await this.guardarPartida();
  }

  private async guardarPartida() {
    const tiempoFinal = this.obtenerTiempoActual();
    const puntaje = this.calcularPuntaje(tiempoFinal);

    this.tiempoPartida = tiempoFinal;
    this.puntajeFinal = puntaje;

    const partida: PartidaAhorcado = {
      usuario: this.authService.usuarioActual() ?.email ?? '',
      palabra: this.palabra,
      gano: this.gano,
      errores: this.errores,
      letras_seleccionadas: this.letrasSeleccionadas.length,
      tiempo: tiempoFinal,
      puntaje: puntaje,
      fecha: new Date().toISOString()
    };

    const { error } = await this.ahorcadoService.guardarPartida(partida);
    if (error) {
      console.error(error);
      return;
    }
    await this.cargarRanking();
  }

  private obtenerTiempoActual(): number {
    return Math.floor((Date.now() - this.tiempoInicio) / 1000);
  }

  async cargarRanking() {
    const { data, error } = await this.ahorcadoService.obtenerRanking();
    if (error) {
      console.error(error);
      return;
    }
    this.ranking = data ?? [];
  }

  mostrarOcultarRanking() {
    this.mostrarRanking = !this.mostrarRanking;
  }

  calcularPuntaje(tiempo: number): number {
    return this.gano ? Math.max( 0, 300 - (this.errores * 10) - tiempo ) : 0;
  }
}