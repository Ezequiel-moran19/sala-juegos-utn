import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  usuarioActual: User | null = null;

  private s_client: SupabaseClient = createClient( environment.supabaseUrl, environment.supabaseKey );

  registro(email: string, password: string) {
    return this.s_client.auth.signUp({ email, password });
  }

  async login(email: string, password: string) {
    const response = await this.s_client.auth.signInWithPassword({ email, password });

    if(response.data.user){
      this.usuarioActual = response.data.user;
    }
    return response;
  }

  async cerrarSesion() {
    this.usuarioActual = null;
    return await this.s_client.auth.signOut();
  }

  async obtenerUsuarioActual() {
    const { data } = await this.s_client.auth.getUser();
    this.usuarioActual = data.user;
    return data.user;
  }

  async obtenerSesion() {
    return await this.s_client.auth.getSession();
  }

  guardarUsuario(usuario: any) {
    return this.s_client.from('usuarios').insert(usuario);
  }

  getClient() {
    return this.s_client;
  }

}