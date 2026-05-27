import { Injectable, signal, computed } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { supabase } from '../supabase/supabase.client';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  usuarioActual = signal<User | null>(null);
  cargandoSesion = signal(true);
  perfil = signal<any>(null);
  estaLogueado = computed(() => this.usuarioActual() !== null);

  constructor() {

    this.checkSession();

    supabase.auth.onAuthStateChange(async (_, session) => {
      await this.actualizarSesion(session?.user ?? null);
    });
  }

  private async actualizarSesion(user: User | null) {

    this.usuarioActual.set(user);

    if(user){
      await this.cargarPerfil(user.id);
    }
    else{
      this.perfil.set(null);
    }

    this.cargandoSesion.set(false);
  }

  async checkSession() {

    const { data: { session } } = await supabase.auth.getSession();

    await this.actualizarSesion(session?.user ?? null);
  }

  async cargarPerfil(userId: string) {

    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId);

    this.perfil.set(data?.[0] ?? null);
  }

  registro(email: string, password: string) {
    return supabase.auth.signUp({ email, password });
  }

  async login(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  }

  async cerrarSesion() {
    return await supabase.auth.signOut();
  }
}