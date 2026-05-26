import { Injectable } from '@angular/core';
import { supabase } from '../../supabase/supabase.client';
import { PartidaAhorcado } from '../../../interfaces/juegos/ahorcado/partida-ahorcado';
import { generarRanking } from '../../../utils/generar-ranking';

@Injectable({
  providedIn: 'root',
})

export class AhorcadoService {

  async guardarPartida(partida: PartidaAhorcado) {
    return await supabase.from('partidas_ahorcado').insert(partida);
  }

  async obtenerRanking() {
    const { data, error } = await supabase.from('partidas_ahorcado').select('usuario, puntaje');
    if (error) {
      return { data: null, error };
    }

    return {
      data: generarRanking(data),
      error: null
    };
  }
}