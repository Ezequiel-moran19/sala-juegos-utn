import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from "@angular/router";

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class Home implements OnInit {

  authService: AuthService = inject(AuthService);

  mensajeExito: string = '';

  async ngOnInit() {
    await this.authService.obtenerUsuarioActual();
  }

  async logout() {
    await this.authService.cerrarSesion();
    this.mensajeExito = 'Sesion cerrada correctamente.';

    setTimeout(() => {
      this.mensajeExito = '';
    }, 3000);
  }
}