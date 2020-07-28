import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { promise } from 'protractor';

const TOUR_KEY = "tours";
const AUDIO_KEY = "audios";

@Injectable({
    providedIn: 'root'
})

export class StorageService {

    public sessionData = new BehaviorSubject<any[]>([]);
    constructor(
        public storage: Storage,
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


    remove(key: string) {
        this.storage.remove(key);
    }

    async getLocalAudios(): Promise < any >{
        let localAudios= [];
        try {
            const result = await this.storage.forEach( (value, key, index) => {
                let json = JSON.parse(value);
                //console.log("vuelta "+index,json.type)
                if(json.type == "audio"){
                    console.log("en audio");
                    localAudios.push(json);
                }
            });
            return localAudios;
        } catch (error) {
            return null;
        }
    }

    async getlocalTours(): Promise < any > {
        let localTours = [];
        try {
            const result = await this.storage.forEach( (value, key, index) => {
                let json = JSON.parse(value);
                //console.log("vuelta "+index,json.type)
                if(json.type == "tour"){
                    console.log("en tour");
                    localTours.push(json);
                }
            });
            return localTours;
        } catch (error) {
            return null;
        }
    }

    getAllObjects(){
        console.log("obteniendo locales");
        this.storage.forEach( (value, key, index) => {
            console.log("value", JSON.parse(value));
            console.log("key", key);
            console.log("Index",index);
        });
    }

    clear() {
        this.storage.clear();
    }
}