import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { supabase } from '../../supabase/supabase.client';
import { generarRanking } from '../../../utils/generar-ranking';

@Injectable({
  providedIn: 'root',
})
export class PreguntadosService {

  private http = inject(HttpClient);

  obtenerPreguntas() {
    return this.http.get<any>('https://opentdb.com/api.php?amount=10&type=multiple');
  }

  mapearPreguntas(data: any) {
    return data.results.map((p: any) => ({
      pregunta: p.question,
      respuestaCorrecta: p.correct_answer,
      respuestasIncorrectas: p.incorrect_answers
    }));
  }

  mezclarOpciones(opciones: string[]) {
    return [...opciones].sort(() => Math.random() - 0.5);
  }

  async guardarPartida(partida: { usuario: string; puntaje: number }) {
    return await supabase
      .from('partidas_preguntados')
      .insert(partida);
  }

  async obtenerRanking() {

    const { data, error } = await supabase
      .from('partidas_preguntados')
      .select('usuario, puntaje');

    if (error || !data) {
      return { data: [], error };
    }

    return {
      data: generarRanking(data),
      error: null
    };
  }
}