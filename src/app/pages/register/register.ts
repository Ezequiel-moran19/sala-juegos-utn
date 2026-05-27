import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '@supabase/supabase-js';
import { AuthService } from '../../services/auth/auth.service';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { UsuarioRegistro } from '../../interfaces/auth/registro.interface';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  authService = inject(AuthService);
  usuariosService = inject(UsuariosService);
  router = inject(Router);

  mensajeError = signal('');
  mensajeExito = signal('');
  cargando = signal(false);

  formRegistro = new FormGroup({
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    edad: new FormControl('', [ Validators.required, Validators.min(18) ]),
    email: new FormControl('', [ Validators.required, Validators.email ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(6) ]),
  });

  async onSubmit() {
    this.limpiarMensajes();

    if (this.formRegistro.invalid) {
      this.formRegistro.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    await this.registrarUsuario();
  }

  limpiarMensajes() {
    this.mensajeError.set('');
    this.mensajeExito.set('');
  }

  async registrarUsuario() {
    const form = this.formRegistro.value;
    const { data, error } = await this.authService.registro( form.email!, form.password! );

    if (error) {
      this.manejarError(error);
      return;
    }

    const user = data.user;

    if (!user) {
      this.mensajeError.set('No se pudo obtener el usuario');
      this.cargando.set(false);
      return;
    }
    await this.guardarUsuarioDB(user);
  }

  manejarError(error: any) {
    this.cargando.set(false);
    if (error.code === 'user_already_exists') {
      this.mensajeError.set( 'El usuario ya se encuentra registrado' );

    } else {
      this.mensajeError.set( 'Error al registrar usuario' );
    }
    this.resetearFormulario();
  }

  resetearFormulario() {
    this.formRegistro.reset();
    setTimeout(() => {
      this.mensajeError.set('');
      const inputName = document.getElementById('name');
      inputName?.focus();
    }, 3000);
  }

  async guardarUsuarioDB(user: User) {
    const form = this.formRegistro.value;
    const usuario: UsuarioRegistro = { nombre: form.nombre!, apellido: form.apellido!, edad: Number(form.edad), email: user.email! };
    const { error } = await this.usuariosService.guardarUsuario( user.id, usuario );

    this.cargando.set(false);

    if (error) {
      this.mensajeError.set( 'Error al guardar usuario en la base de datos' );
      return;
    }

    await this.authService.login(
      form.email!,
      form.password!
    );

    this.mensajeExito.set( 'Usuario registrado correctamente' );
    this.formRegistro.reset();

    setTimeout(() => {
      this.mensajeExito.set('');
      this.router.navigate(['/']);
    }, 3000);
  }
}