import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { RouterLink } from "@angular/router";
import { JUEGOS } from '../../data/lista-juegos';
import { GameCard } from "../../components/game-card/game-card";

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink, GameCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class Home {
  authService: AuthService = inject(AuthService);

  juegos = JUEGOS;
}