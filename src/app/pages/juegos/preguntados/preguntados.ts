import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PreguntadosService } from '../../../services/juegos/preguntados-service/preguntados.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Pregunta } from '../../../interfaces/juegos/preguntados/pregunta.interface';
import { Rankings } from '../../../interfaces/ranking/ranking';
import { RankingComponent } from "../../../components/ranking/ranking";

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule, RankingComponent, RouterLink],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css',
})
export class Preguntados implements OnInit {

  authService = inject(AuthService);
  preguntadosService = inject(PreguntadosService);
  private cdr = inject(ChangeDetectorRef);

  preguntas: Pregunta[] = [];
  preguntaActual?: Pregunta;
  opciones: string[] = [];
  indiceActual = 0;
  juegoTerminado = false;
  cargando = true;
  mostrarRanking = false;
  ranking: Rankings[] = [];
  puntaje = 0;
  respuestasCorrectas = 0;
  errores = 0;
  tiempoInicio = 0;

  ngOnInit() {
    this.cargarPreguntas();
    this.tiempoInicio = Date.now();
  }

  cargarPreguntas() {

    this.cargando = true;
    this.preguntadosService.obtenerPreguntas()
      .subscribe({
        next: (data) => {
          this.preguntas = this.preguntadosService.mapearPreguntas(data);
          this.indiceActual = 0;
          this.juegoTerminado = false;
          this.cargarPreguntaActual();
          this.cargando = false;
          this.cdr.detectChanges();
        },

        error: (err) => {
          console.log(err);
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
  }

  cargarPreguntaActual() {

    if (this.indiceActual < this.preguntas.length) {
      this.preguntaActual = this.preguntas[this.indiceActual];
      this.opciones = this.preguntadosService.mezclarOpciones([
        this.preguntaActual.respuestaCorrecta,
        ...(this.preguntaActual.respuestasIncorrectas ?? [])
      ]);

    } else {
      this.juegoTerminado = true;
      this.finalizarJuego();
    }
  }

  responder(opcion: string) {
    if (opcion === this.preguntaActual?.respuestaCorrecta) {
      this.respuestasCorrectas++;
      this.puntaje += 100;

    } else {
      this.errores++;
      this.puntaje = Math.max(0, this.puntaje - 25);
    }

    this.indiceActual++;
    this.cargarPreguntaActual();
  }

  private async finalizarJuego() {

    const tiempo = Math.floor((Date.now() - this.tiempoInicio) / 1000);
    const bonusTiempo = Math.max(0, 200 - tiempo);

    this.puntaje += bonusTiempo;

    if (this.errores === 0) {
      this.puntaje += 300;
    }

    const usuario = this.authService.usuarioActual()?.email ?? '';
    const partida = { usuario, puntaje: this.puntaje, aciertos: this.respuestasCorrectas, errores: this.errores, tiempo };

    const { error } = await this.preguntadosService.guardarPartida(partida);

    if (error) {
      console.error(error);
      return;
    }
    await this.cargarRanking();
    this.mostrarRanking = true;
  }

  async cargarRanking() {

    const { data, error } = await this.preguntadosService.obtenerRanking();

    if (error) {
      console.error(error);
      return;
    }

    this.ranking = data ?? [];
  }

  mostrarOcultarRanking() {
    this.mostrarRanking = !this.mostrarRanking;
  }

  reiniciarJuego() {
    this.preguntas = [];
    this.preguntaActual = undefined;
    this.opciones = [];
    this.indiceActual = 0;
    this.puntaje = 0;
    this.juegoTerminado = false;
    this.mostrarRanking = false;
    this.cargando = true;

    this.cargarPreguntas();
  }
}