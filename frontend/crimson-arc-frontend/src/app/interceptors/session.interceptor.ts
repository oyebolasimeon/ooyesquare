import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionExpiredModalComponent } from '../components/shared/session-expired-modal.component';

export const sessionInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const modalService = inject(NgbModal);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check if error is due to session being replaced (401 with SESSION_REPLACED code)
      if (error.status === 401 && error.error?.code === 'SESSION_REPLACED') {
        // Force logout
        authService.forceLogout();

        // Show session expired modal
        const modalRef = modalService.open(SessionExpiredModalComponent, {
          centered: true,
          backdrop: 'static',
          keyboard: false
        });

        modalRef.result.then(() => {
          router.navigate(['/login']);
        });
      }

      return throwError(() => error);
    })
  );
};

