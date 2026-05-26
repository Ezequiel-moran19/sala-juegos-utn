import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CARTAS, PUNTAJE_ACIERTO } from '../../../data/mayor-menor.const';
import { AuthService } from '../../../services/auth/auth.service';
import { MayorMenorService } from '../../../services/juegos/mayor-menor-service/mayor-menor.service';
import { Rankings } from '../../../interfaces/ranking/ranking';
import { PartidaMayorMenor } from '../../../interfaces/juegos/mayor-menor/partida-mayor-menor';
import { RankingComponent } from '../../../components/ranking/ranking';

@Component({
  selector: 'app-mayor-menor',
  imports: [ RouterLink, RankingComponent ],
  templateUrl: './mayor-menor.html',
  styleUrl: './mayor-menor.css',
})

export class MayorMenor implements OnInit {

  authService = inject(AuthService);
  mayorMenorService = inject(MayorMenorService);

  readonly cartas = CARTAS;
  readonly puntajeAcierto = PUNTAJE_ACIERTO;

  cartaActual = '';
  puntaje = 0;
  cartasAcertadas = 0;
  juegoTerminado = false;
  mostrarRanking = false;
  ranking: Rankings[] = [];

  async ngOnInit() {
    this.iniciarJuego();
    await this.cargarRanking();
  }

  iniciarJuego() {
    this.cartaActual = this.obtenerCartaAleatoria();
    this.resetEstadoJuego();
  }

  private resetEstadoJuego() {
    this.puntaje = 0;
    this.cartasAcertadas = 0;
    this.juegoTerminado = false;
  }

  private obtenerCartaAleatoria(): string {
    const indice = Math.floor(Math.random() * this.cartas.length );
    return this.cartas[indice];
  }

  private obtenerValorCarta( carta: string ): number {
    if (carta === 'A') return 1;
    if (carta === 'J') return 11;
    if (carta === 'Q') return 12;
    if (carta === 'K') return 13;
    return Number(carta);
  }

  elegir( opcion: 'mayor' | 'menor' ) {

    if (this.juegoTerminado) return;
    const nuevaCarta = this.obtenerCartaAleatoria();
    const valorActual = this.obtenerValorCarta( this.cartaActual );
    const valorNuevo = this.obtenerValorCarta( nuevaCarta );

    if (valorNuevo === valorActual) {
      this.cartaActual = nuevaCarta;
      return;
    }

    const acerto = opcion === 'mayor' ? valorNuevo > valorActual : valorNuevo < valorActual;
    if (acerto) {
      this.actualizarEstadoJuego( nuevaCarta );

    } else {
      this.finalizarJuego();
    }
  }

  private actualizarEstadoJuego( nuevaCarta: string) {
    this.puntaje += this.puntajeAcierto;
    this.cartasAcertadas++;
    this.cartaActual = nuevaCarta;
  }

  private async finalizarJuego() {
    this.juegoTerminado = true;
    await this.guardarPartida();
  }

  private async guardarPartida() {
    const partida: PartidaMayorMenor = {
      usuario: this.authService.usuarioActual() ?.email ?? '',
      cartas_acertadas: this.cartasAcertadas,
      puntaje: this.puntaje,
      fecha: new Date().toISOString()
    };

    const { error } = await this.mayorMenorService.guardarPartida(partida);

    if (error) { console.error(error); return; }

    await this.cargarRanking();
  }

  async cargarRanking() {

    const { data, error } = await this.mayorMenorService.obtenerRanking();

    if (error) { console.error(error); return; }
    this.ranking = data ?? [];
  }

  mostrarOcultarRanking() {
    this.mostrarRanking = !this.mostrarRanking;
  }
}