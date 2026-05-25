import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const usuario = authService.usuarioActual();

  if (usuario) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};