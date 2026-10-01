import {Observable} from 'rxjs';
import {HttpEvent, HttpHandlerFn, HttpHeaders, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {API_VERSION, USE_AUTH, USE_REQUEST_ID, X_FUNCTION_KEY} from "./http-context.tokens";

export const apiInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const useAuth: boolean = req.context.get(USE_AUTH);
    const apiVersion: string = req.context.get(API_VERSION);
    const useRequestId: boolean = req.context.get(USE_REQUEST_ID);
    const functionKey: string = req.context.get(X_FUNCTION_KEY);

    let headers: HttpHeaders = req.headers.set('x-api-version', apiVersion);

    if (useAuth) {
        const token: string | null = getToken();
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }
    }

    if (req.method === 'POST') {
        if (useRequestId) {
            headers = headers.set('x-request-id', crypto.randomUUID().replace(/-/g, ''));
        }

        headers = headers.set('x-function-key', functionKey);
    }

    return next(req.clone({headers}));
};

function getToken(): string | null {
    return "1234567890abcdefgh";
}