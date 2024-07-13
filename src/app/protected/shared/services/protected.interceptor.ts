import { HttpErrorResponse, HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../../environments/environment.prod';
import { catchError, throwError } from 'rxjs';

export const protectedInterceptor: HttpInterceptorFn = (req, next) => {
    const headers = new HttpHeaders({
        "Authorization": `Beared ${environment.API_KEY}`
    });

    const modifiedReq = req.clone({ headers });

    const handleErrors = (error: HttpErrorResponse) => {
        return throwError(() => `Error al establecer el encabezado de la solicitud: ${error}`);
    }

    return next(modifiedReq)
        .pipe(
            catchError(handleErrors)
        );
};
