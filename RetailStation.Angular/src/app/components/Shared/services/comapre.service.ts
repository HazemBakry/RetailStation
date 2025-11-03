import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ItemCompareModel {
    merchantItemId: number;
    itemId: number;
}

const LOCAL_STORAGE_KEY = 'compareItems';

@Injectable({
    providedIn: 'root'
})
export class CompareService {
    // A private BehaviorSubject to manage the list internally
    private _compareListSource = new BehaviorSubject<ItemCompareModel[]>([]);

    // Public observable for components to subscribe to
    compareList$: Observable<ItemCompareModel[]> = this._compareListSource.asObservable();

    // Public observable for a simple count, derived from the list
    itemCount$: Observable<number> = this.compareList$.pipe(
        map(items => items.length)
    );

    constructor() {
        // Load the data from local storage when the service is initialized
        this.loadFromLocalStorage();
    }

    // Add an item to the compare list
    addItem(merchantItemId: number, itemId: number): void {
        let item: ItemCompareModel = {
            merchantItemId: merchantItemId,
            itemId: itemId
        }
        const currentList = this._compareListSource.value;

        // Check if the item already exists to prevent duplicates
        const isExist = currentList.some(
            i => i.merchantItemId === item.merchantItemId
        );

        if (!isExist) {
            const updatedList = [...currentList, item];
            this._compareListSource.next(updatedList);
            this.saveToLocalStorage(updatedList);
        }
    }

    // Remove an item from the compare list
    removeItem(merchantItemId: number, itemId: number): void {
        let item: ItemCompareModel = {
            merchantItemId: merchantItemId,
            itemId: itemId
        }
        const currentList = this._compareListSource.value;
        const updatedList = currentList.filter(
            i => i.merchantItemId !== item.merchantItemId
        );
        this._compareListSource.next(updatedList);
        this.saveToLocalStorage(updatedList);
    }

    // Check if a specific item is in the list
    isItemInList(itemId: number): boolean {
        return this._compareListSource.value.some(item => item.merchantItemId === itemId);
    }

    // Clear the entire compare list
    clearList(): void {
        this._compareListSource.next([]);
        this.saveToLocalStorage([]);
    }

    // Private method to save the list to local storage
    private saveToLocalStorage(list: ItemCompareModel[]): void {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
        } catch (e) {
            console.error('Error saving to local storage', e);
        }
    }

    // Private method to load the list from local storage
    private loadFromLocalStorage(): void {
        try {
            const storedList = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedList) {
                const items: ItemCompareModel[] = JSON.parse(storedList);
                this._compareListSource.next(items);
            }
        } catch (e) {
            console.error('Error loading from local storage', e);
            // Fallback to an empty list if loading fails
            this._compareListSource.next([]);
        }

    }
    getCurrentList(): ItemCompareModel[] {
  return this._compareListSource.value;
}
}