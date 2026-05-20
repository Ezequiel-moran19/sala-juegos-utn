import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { UsuarioRegistro } from '../../interfaces/registro.interface';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export class Register {

  authService = inject(AuthService);
  router = inject(Router);
  mensajeError = '';
  mensajeExito = '';
  cargando = false;

  formRegistro = new FormGroup({
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    edad: new FormControl('', [ Validators.required, Validators.min(18) ]),
    email: new FormControl('', [ Validators.required, Validators.email ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(6) ]),
  });

  async onSubmit() {

    this.limpiarMensajes();

    if(this.formRegistro.invalid){
      this.formRegistro.markAllAsTouched();
      return;
    }

    this.cargando = true;
    await this.registrarUsuario();
  }

  limpiarMensajes(){
    this.mensajeError = '';
    this.mensajeExito = '';
  }

  async registrarUsuario(){

    const email = this.formRegistro.value.email!;
    const password = this.formRegistro.value.password!;
    const { data, error } = await this.authService.registro(email, password);

    if(error){
      this.manejarError(error);
      return;
    }

    const user = data.user;

    if(!user){
      this.mensajeError = 'No se pudo obtener el usuario';
      this.cargando = false;
      return;
    }
    await this.guardarUsuarioDB(user);

  }

  manejarError(error: any){
    this.cargando = false;
    if(error.code === 'user_already_exists'){
      this.mensajeError = 'El usuario ya se encuentra registrado';
    } else {
      this.mensajeError = error.message;
    }
  }

  async guardarUsuarioDB(user: any){

    const usuario: UsuarioRegistro = {
      nombre: this.formRegistro.value.nombre!,
      apellido: this.formRegistro.value.apellido!,
      edad: Number(this.formRegistro.value.edad),
      email: user.email,
    };

    const { error } = await this.authService.guardarUsuario({
      id: user.id,
      ...usuario
    });

    this.cargando = false;

    if(error){
      this.mensajeError = 'Error al guardar usuario en la base de datos';
      return;
    }

    await this.authService.login(
      this.formRegistro.value.email!,
      this.formRegistro.value.password!
    );

    this.mensajeExito = 'Usuario registrado correctamente';

    this.formRegistro.reset();

    this.router.navigate(['/']);
  }

}