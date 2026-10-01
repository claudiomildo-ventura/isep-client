import {ApplicationConfig} from '@angular/core';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading} from '@angular/router';
import {apiInterceptor} from './core/interceptor/interceptor';
import {ROUTES} from './app.route';

export const APP_CONFIG: ApplicationConfig = {
    providers: [
        provideHttpClient(withInterceptors([apiInterceptor])),
        provideRouter(ROUTES,
            withPreloading(PreloadAllModules),
            withInMemoryScrolling({
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled'
            })
        ),
    ]
};