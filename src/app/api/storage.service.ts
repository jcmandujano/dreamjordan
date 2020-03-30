import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

export interface Item {
  id:number,
  element:any
}

const KEY = "checkout";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: NativeStorage,) { }

  addItem(item:Item): Promise<any>{
    return this.storage.getItem(KEY).then(( items: Item[]) => {
      if(items){
        items.push(item);
        return this.storage.setItem(KEY,[item]);
      }else{
        return this.storage.setItem(KEY,[item]);
      }
    });
  }

  getItems(){
    return this.storage.getItem(KEY);
  }

  updateItem(item:Item){
    return this.storage.getItem(KEY).then(( items: Item[]) => {
      if(!items || items.length === 0){
        return null;
      }
      let newItems : Item[] = [];
      for(let i of items){
        if(i.id === item.id){
          newItems.push(item);
        }else{
          newItems.push(i);
        }
      }
      return this.storage.setItem(KEY,newItems);
    });
  }

  deleteItem(id:number):Promise<Item>{
    return this.storage.getItem(KEY).then(( items: Item[]) => {
      if(!items || items.length === 0){
        return null;
      }
      let toKeep : Item[] = [];
      for(let i of items){
        if(i.id !== id){
          toKeep.push(i);
        }
      }
      return this.storage.setItem(KEY,toKeep);
    });

  }

}
