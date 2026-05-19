import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginUsuario } from '../../interfaces/login.interface';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  authService: AuthService = inject(AuthService);
  router: Router = inject(Router)
  mensajeError: string = '';
  cargando: boolean = false;

  formLogin = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  async onSubmit() {
    this.limpiarMensaje();

    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();// Marcar todos los campos como tocados para mostrar los errores de validación
      return;
    }
    this.cargando = true;
    await this.iniciarSesion();
  }

  limpiarMensaje() {
    this.mensajeError = '';
  }

  async iniciarSesion() {
    const usuario: LoginUsuario = { email: this.formLogin.value.email!, password: this.formLogin.value.password!,};
    const { error } = await this.authService.login(usuario.email, usuario.password);

    this.cargando = false;

    if (error) {
      this.manejarError(error);
    } else {
      this.router.navigate(['/']);
    }
  }

  manejarError(error: any) {
    if (error.code === 'Credenciales inválidas') {
      this.mensajeError = 'Correo electrónico o contraseña incorrectos.';
    }
    else {
      this.mensajeError = error.message || 'Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.';
    }
  }

  loginRapido(email: string, password: string) {
    this.formLogin.patchValue({ email, password });
  }

}
