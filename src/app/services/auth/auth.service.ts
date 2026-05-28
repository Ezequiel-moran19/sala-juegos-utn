import { Injectable, signal, computed } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { supabase } from '../supabase/supabase.client';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  usuarioActual = signal<User | null>(null);
  perfil = signal<any>(null);

  cargandoSesion = signal(true);
  perfilCargado = signal(false);

  authReady = signal(false);

  estaLogueado = computed(() => this.usuarioActual() !== null);

  constructor() {
    this.init();
  }

  private async init() {
    await this.checkSession();
    this.authReady.set(true);

    supabase.auth.onAuthStateChange(async (_, session) => {
      await this.actualizarSesion(session?.user ?? null);
    });
  }

  private async actualizarSesion(user: User | null) {

    this.perfilCargado.set(false);
    this.cargandoSesion.set(true);

    this.usuarioActual.set(user);

    if (user) {
      await this.cargarPerfil(user.id);
    } else {
      this.perfil.set(null);
    }

    this.perfilCargado.set(true);
    this.cargandoSesion.set(false);
  }

  async checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    await this.actualizarSesion(session?.user ?? null);
  }

  private async cargarPerfil(userId: string) {

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle(); 

    if (error) {
      console.error('[Auth] error perfil:', error);
      this.perfil.set(null);
      return;
    }

    this.perfil.set(data ?? null);
  }

  async login(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  }

  async registro(email: string, password: string) {
    return await supabase.auth.signUp({ email, password });
  }

  async cerrarSesion() {
    return await supabase.auth.signOut();
  }
}