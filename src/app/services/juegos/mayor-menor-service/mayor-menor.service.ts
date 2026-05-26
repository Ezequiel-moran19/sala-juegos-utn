import { Injectable } from '@angular/core';
import { supabase } from '../../supabase/supabase.client';
import { PartidaMayorMenor } from '../../../interfaces/juegos/mayor-menor/partida-mayor-menor';
import { generarRanking } from '../../../utils/generar-ranking';

@Injectable({
  providedIn: 'root',
})

export class MayorMenorService {

  async guardarPartida(partida: PartidaMayorMenor) {

    return await supabase.from('partidas_mayor_menor').insert(partida);
  }

  async obtenerRanking() {

    const { data, error } = await supabase.from('partidas_mayor_menor').select('usuario, puntaje');

    if (error) {
      return { data: null, error };
    }

    return { data: generarRanking(data), error: null };
  }
}