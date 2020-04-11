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
    return this.storage.getItem(key);
  }

  public clear(): void {
    this.storage.clear();
  }

}
