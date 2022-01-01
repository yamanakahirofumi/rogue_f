import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage;

  constructor() {
    this.storage = sessionStorage;
  }

  public set(key: string, value: string): void {
    this.storage.setItem(key, value);
  }

  public get(key: string): string {
    const item = this.storage.getItem(key);
    if (item === null) {
      return "";
    }
    return item;
  }

  public clear(): void {
    this.storage.clear();
  }
}
