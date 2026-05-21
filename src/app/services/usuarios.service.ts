import { Injectable } from '@angular/core';
import { UsuarioRegistro } from '../interfaces/registro.interface';
import { supabase } from './supabase.client';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
    guardarUsuario(id: string, usuario: UsuarioRegistro) {
    return supabase.from('usuarios').insert({ id, ...usuario })
    }
}