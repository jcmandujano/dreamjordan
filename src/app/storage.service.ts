import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { BehaviorSubject } from 'rxjs';

export interface Item {
    id:number,
    element:any
  }

@Injectable({
    providedIn: 'root'
})

export class StorageService {

    public sessionData = new BehaviorSubject<any[]>([]);
    constructor(
        public storage: Storage,
        private native_storage: NativeStorage
    ) {}
    //USED FOR STORE SESSION INFO
    async set(key: string, value: any): Promise < any > {
        try {
            const result = await this.storage.set(key, value);
            this.sessionData.next(value);
            return true;
        } catch (error) {
            return false;
        }
    }
    //USED FOR STORE SESSION INFO
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

    async addItem(item:Item, key:string): Promise<any>{
        return this.native_storage.getItem(key).then(( items: Item[]) => {
          if(items){
            items.push(item);
            return this.native_storage.setItem(key,[item]);
          }else{
            return this.native_storage.setItem(key,[item]);
          }
        });
      }

    remove(key: string) {
        this.storage.remove(key);
    }

    clear() {
        this.storage.clear();
    }
}