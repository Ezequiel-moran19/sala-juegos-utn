import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  authService = inject(AuthService);
  router = inject(Router);

  mensajeError = signal('');
  cargando = signal(false);

  formLogin = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  async onSubmit() {

    this.limpiarMensaje();

    if (this.formLogin.invalid) {

      this.formLogin.markAllAsTouched();

      return;
    }

    this.cargando.set(true);

    await this.iniciarSesion();

  }

  limpiarMensaje() {
    this.mensajeError.set('');
  }

  async iniciarSesion() {

    const form = this.formLogin.value;
    const { error } = await this.authService.login( form.email!, form.password! );

    this.cargando.set(false);

    if (error) {

      this.manejarError(error);

      return;
    }

    this.router.navigate(['/']);

  }

  manejarError(error: any) {

    if (error.code === 'invalid_credentials') {

      this.mensajeError.set( 'Correo electrónico o contraseña incorrectos.' );

    } else {

      this.mensajeError.set( 'Error al iniciar sesión.' );

    }

    this.resetearFormulario();

  }

  resetearFormulario() {

    setTimeout(() => {

      this.mensajeError.set('');
      this.formLogin.reset();

      const inputEmail = document.getElementById('email');

      inputEmail?.focus();

    }, 3000);

  }

  loginRapido(email: string, password: string) {
    this.formLogin.patchValue({ email, password });
  }

}