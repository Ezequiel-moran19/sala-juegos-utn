import { Injectable, signal, computed } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Estado de autenticación
  usuarioActual = signal<User | null>(null);
  // Indica si se está cargando la sesión actual
  cargandoSesion = signal(true);
  // Computed para verificar si el usuario está logueado
  estaLogueado = computed(() => this.usuarioActual() !== null);

  private s_client: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    }
  );

  constructor() {
      this.checkSession();
      this.s_client.auth.onAuthStateChange((event, session) => {
      this.usuarioActual.set(session?.user ?? null);
      this.cargandoSesion.set(false);
    });

  }

  async checkSession() {

    const { data: { session } } = await this.s_client.auth.getSession();

    this.usuarioActual.set(session?.user ?? null); 

    this.cargandoSesion.set(false);
  }

  registro(email: string, password: string) {
    return this.s_client.auth.signUp({ email, password });
  }

  async login(email: string, password: string) {
    
    const response = await this.s_client.auth.signInWithPassword({ email, password });

    if (response.data.user) {
      this.usuarioActual.set(response.data.user);
    }

    return response;
  }

  async cerrarSesion() {

    this.usuarioActual.set(null);

    return await this.s_client.auth.signOut();
  }

  guardarUsuario(usuario: any) {
    return this.s_client.from('usuarios').insert(usuario);
  }

  getClient() {
    return this.s_client;
  }
}