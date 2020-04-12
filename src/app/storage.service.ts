import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    public sessionData = new BehaviorSubject<any[]>([]);
    constructor(
        public storage: Storage
    ) {}

    async set(key: string, value: any): Promise < any > {
        try {
            const result = await this.storage.set(key, value);
            this.sessionData.next(value);
            return true;
        } catch (error) {
            return false;
        }
    }

    async get(key: string): Promise < any > {
        try {
            const result = await this.storage.get(key);
            if (result != null) {
                this.sessionData.next(result);
                return result;
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    async setObject(key: string, object: Object): Promise < any > {
        try {
            const result = await this.storage.set(key, JSON.stringify(object));
            return true;
        } catch (error) {
            return false;
        }
    }

    async getObject(key: string): Promise < any > {
        try {
            const result = await this.storage.get(key);
            if (result != null) {
                return JSON.parse(result);
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    remove(key: string) {
        this.storage.remove(key);
    }

    clear() {
        this.storage.clear();
    }
}