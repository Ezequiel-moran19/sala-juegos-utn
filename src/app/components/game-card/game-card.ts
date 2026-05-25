import { Component, Input } from '@angular/core';
import { cardJuego } from '../../interfaces/juegos/card-juegos.interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-game-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './game-card.html',
  styleUrl: './game-card.css',
})
export class GameCard {
  @Input() juego!: cardJuego;
}
