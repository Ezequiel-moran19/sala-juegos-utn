import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {
    const auth = inject(AuthService);

    return auth.perfil()?.role === 'admin';
};
