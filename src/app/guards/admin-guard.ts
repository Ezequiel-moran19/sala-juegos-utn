import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

export const adminGuard: CanActivateFn = async () => {

  const auth = inject(AuthService);

  await auth.checkSession();

  while (!auth.perfilCargado()) {
    await new Promise(r => setTimeout(r, 10));
  }

  const perfil = auth.perfil();

  return perfil?.role === 'admin';
};