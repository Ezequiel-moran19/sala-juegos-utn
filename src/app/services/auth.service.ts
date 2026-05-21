import { Injectable, signal, computed } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabase.client';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  usuarioActual = signal<User | null>(null);
  cargandoSesion = signal(true);
  estaLogueado = computed(() => this.usuarioActual() !== null);

  constructor() {

    this.checkSession();

    supabase.auth.onAuthStateChange((_, session) => {
      this.actualizarSesion(session?.user ?? null);
    });
  }

  private actualizarSesion(user: User | null) {

    this.usuarioActual.set(user);
    this.cargandoSesion.set(false);
  }

  async checkSession() {

    const { data: { session } } = await supabase.auth.getSession();
    this.actualizarSesion(session?.user ?? null);
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