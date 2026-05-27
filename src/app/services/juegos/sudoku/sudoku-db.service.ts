import { Injectable } from '@angular/core';
import { supabase } from '../../supabase/supabase.client';
import { PartidaSudoku } from '../../../interfaces/juegos/sudoku/partida-sudoku';
import { generarRanking } from '../../../utils/generar-ranking';

@Injectable({
  providedIn: 'root'
})

export class SudokuDbService {

  async guardarPartida(partida: PartidaSudoku) {
    return await supabase.from('partidas_sudoku').insert(partida);
  }

  async obtenerRanking() {
    const { data, error } = await supabase.from('partidas_sudoku').select('usuario, puntaje');

    if(error){
      return {
        data: null,
        error
      };
    }

    return {
      data: generarRanking(data),
      error: null
    };
  }
}