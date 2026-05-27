import { Injectable } from '@angular/core';
import { supabase } from '../supabase/supabase.client';

@Injectable({
  providedIn: 'root',
})
export class EncuestaService {
  guardar(data: any) {
    return supabase.from('encuestas').insert(data);
  }

  obtener() {
    return supabase.from('encuestas').select('*');
  }
}
