import { Injectable } from '@angular/core';
import { supabase } from '../supabase/supabase.client';
import { MensajeChat } from '../../interfaces/chat/mensaje-chat';

@Injectable({
  providedIn: 'root',
})

export class ChatService {

  crearMensaje(usuario: string, texto: string): MensajeChat {
    return {
      usuario: usuario,
      mensaje: texto,
      fecha: new Date().toISOString()
    };
  }

  async enviarMensaje(mensaje: MensajeChat) {
    return await supabase.from('mensajes_chat').insert(mensaje);
  }

  async obtenerMensajes() {
    return await supabase.from('mensajes_chat').select('*').order('fecha',{ascending: true});
  }
}