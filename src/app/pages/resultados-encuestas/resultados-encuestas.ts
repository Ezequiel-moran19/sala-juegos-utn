import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { EncuestaService } from '../../services/encuesta/encuesta.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resultados-encuestas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados-encuestas.html',
  styleUrl: './resultados-encuestas.css',
})
export class ResultadosEncuestas implements OnInit {
 private encuestaService = inject(EncuestaService);
  cdr = inject(ChangeDetectorRef);
  encuestas: any[] = [];

  async ngOnInit() {

    const { data, error } = await this.encuestaService.obtener();
    this.encuestas = data ?? [];
    this.cdr.detectChanges();
  }
}
