import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EncuestaService } from '../../services/encuesta/encuesta.service';
import { EncuestaData } from '../../interfaces/encuesta/encuesta.interface';

@Component({
  selector: 'app-encuesta',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './encuesta.html',
  styleUrl: './encuesta.css',
})
export class Encuesta {
  private fb = inject(FormBuilder);
  private encuestaService = inject(EncuestaService);
  private authService = inject(AuthService);
  private router = inject(Router);
  mensajeError = signal('');
  mensajeExito = signal('');
  cargando = signal(false);
  errorIntereses = false;

  encuestaForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(10)]],
      pregunta1: ['', Validators.required],
      pregunta2: ['', Validators.required],
      intereses: [[] as string[], Validators.required]
    });

  seleccionarInteres(valor: string, event: Event) {

    const checkbox = event.target as HTMLInputElement;
    let intereses = [...(this.encuestaForm.get('intereses')?.value || [])];

    if (checkbox.checked) {
      if (!intereses.includes(valor)) {
        intereses.push(valor);
      }
    } else {
      intereses = intereses.filter(i => i !== valor);
    }

    this.encuestaForm.patchValue({ intereses });
    this.errorIntereses = intereses.length === 0;
  }

  async enviar() {

    this.mensajeError.set('');
    this.mensajeExito.set('');

    if (this.encuestaForm.invalid || this.errorIntereses) {
      this.encuestaForm.markAllAsTouched();
      this.mensajeError.set('Completa todos los campos correctamente');
      return;
    }

    const user = this.authService.usuarioActual();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.cargando.set(true);

    const data: EncuestaData = {
      usuario_id: user.id,
      email: user.email!,
      nombre: this.encuestaForm.value.nombre!,
      apellido: this.encuestaForm.value.apellido!,
      edad: Number(this.encuestaForm.value.edad),
      telefono: this.encuestaForm.value.telefono!,
      pregunta1: this.encuestaForm.value.pregunta1!,
      pregunta2: this.encuestaForm.value.pregunta2!,
      intereses: this.encuestaForm.value.intereses || []
    };
    const { error } = await this.encuestaService.guardar(data);

    this.cargando.set(false);

    if (error) {
      this.mensajeError.set('Error al guardar encuesta');
      return;
    }

    this.mensajeExito.set('Encuesta enviada correctamente');
    this.encuestaForm.reset();

    setTimeout(() => {
      this.router.navigate(['/']);
    }, 2000);
  }
}

