import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingComponent } from '../../components/ranking/ranking';
import { Rankings } from '../../interfaces/ranking/ranking';
import { AhorcadoService } from '../../services/juegos/ahorcado-service/ahorcado.service';
import { MayorMenorService } from '../../services/juegos/mayor-menor-service/mayor-menor.service';
import { PreguntadosService } from '../../services/juegos/preguntados-service/preguntados.service';
import { SudokuDbService } from '../../services/juegos/sudoku/sudoku-db.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule, RankingComponent],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css'
})

export class Resultados implements OnInit {

  private ahorcadoService = inject(AhorcadoService);
  private mayorMenorService = inject(MayorMenorService);
  private preguntadosService = inject(PreguntadosService);
  private sudokuService = inject(SudokuDbService);
  private cdr = inject(ChangeDetectorRef);

  rankingAhorcado: Rankings[] = [];
  rankingMayorMenor: Rankings[] = [];
  rankingPreguntados: Rankings[] = [];
  rankingSudoku: Rankings[] = [];

  async ngOnInit() {

    this.cargarRankings();
  }

  async cargarRankings() {

    const ahorcado = await this.ahorcadoService.obtenerRanking();
    const mayorMenor = await this.mayorMenorService.obtenerRanking();
    const preguntados = await this.preguntadosService.obtenerRanking();
    const sudoku = await this.sudokuService.obtenerRanking();

    this.rankingAhorcado = ahorcado.data ?? [];
    this.rankingMayorMenor = mayorMenor.data ?? [];
    this.rankingPreguntados = preguntados.data ?? [];
    this.rankingSudoku = sudoku.data ?? [];

    this.cdr.detectChanges();
  }
}