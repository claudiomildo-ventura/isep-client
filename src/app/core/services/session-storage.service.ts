import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class SessionService {

    public setItem(key: string, value: unknown): void {
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    public getItem<T>(key: string): T | null {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) as T : null;
    }

    public removeItem(key: string): void {
        sessionStorage.removeItem(key);
    }

    public clear(): void {
        sessionStorage.clear();
    }
}