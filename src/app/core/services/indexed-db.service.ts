import {Injectable} from '@angular/core';
import {DATABASE_SERVICE} from "../../../config/database-service";
import {Table} from "../../shared/interface/Table";

@Injectable({providedIn: 'root'})
export class IndexedDbService {
    private dbPromise!: Promise<IDBDatabase>;

    constructor() {
        this.initializeDatabase();
    }

    private openDatabase(): Promise<IDBDatabase> {
        return new Promise((resolve, reject): void => {
            const request: IDBOpenDBRequest = indexedDB.open(DATABASE_SERVICE.name, DATABASE_SERVICE.version);

            request.onupgradeneeded = (event: IDBVersionChangeEvent): void => {
                const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;

                if (!db.objectStoreNames.contains(DATABASE_SERVICE.storeName)) {
                    // Use unique uid as key
                    const store: IDBObjectStore = db.createObjectStore(DATABASE_SERVICE.storeName, {keyPath: 'uid'});
                    store.createIndex('tableRelationId_idx', 'tableRelationId');
                }
            };

            request.onsuccess = (): void => resolve(request.result);
            request.onerror = (): void => reject(request.error);
        });
    }

    private initializeDatabase(): void {
        this.dbPromise = this.openDatabase();
    }

    public async saveData(columns: Table[]): Promise<void> {
        const database: IDBDatabase = await this.dbPromise;
        const transac: IDBTransaction = database.transaction(DATABASE_SERVICE.storeName, 'readwrite');
        const store: IDBObjectStore = transac.objectStore(DATABASE_SERVICE.storeName);

        columns.forEach((column: Table): IDBRequest<IDBValidKey> => store.put({...column, uid: `idx_${column.id}`}));

        return new Promise((resolve, reject): void => {
            transac.oncomplete = (): void => resolve();
            transac.onerror = (): void => reject(transac.error);
        });
    }

    public async getColumns(): Promise<Table[]> {
        const database: IDBDatabase = await this.dbPromise;
        const transac: IDBTransaction = database.transaction(DATABASE_SERVICE.storeName, 'readonly');
        const store: IDBObjectStore = transac.objectStore(DATABASE_SERVICE.storeName);
        const request: IDBRequest<Table[]> = store.getAll();

        return new Promise((resolve, reject): void => {
            request.onsuccess = (): void => resolve(request.result);
            request.onerror = (): void => reject(request.error);
        });
    }

    public async clearData(): Promise<void> {
        const database: IDBDatabase = await this.dbPromise;

        // 1. Start a transaction in 'readwrite' mode
        const transac: IDBTransaction = database.transaction(DATABASE_SERVICE.storeName, 'readwrite');
        const store: IDBObjectStore = transac.objectStore(DATABASE_SERVICE.storeName);

        // 2. Request to clear the entire object store
        const request: IDBRequest = store.clear();

        // 3. Return a promise that resolves when the transaction completes
        return new Promise((resolve, reject): void => {
            request.onsuccess = (): void => {
                // The 'clear' request succeeded, now wait for the transaction to complete
            };
            request.onerror = (): void => reject(request.error);

            // The transaction completion indicates all operations are finished
            transac.oncomplete = (): void => resolve();
            transac.onerror = (): void => reject(transac.error);
        });
    }
}