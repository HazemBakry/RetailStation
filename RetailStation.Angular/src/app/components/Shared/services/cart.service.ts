import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { ActionsResponseModel } from '../models/ActionsResponseModel';
import { AuthService } from 'src/app/Auth/auth.service';

export interface CartModel {
  cartId?: number;
  merchantItemId: number;
  quantity: number;
  userId: string;
}


const LOCAL_STORAGE_CART_KEY = 'cartItems';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private _cartItemsSource = new BehaviorSubject<CartModel[]>([]);

  cartItems$: Observable<CartModel[]> = this._cartItemsSource.asObservable();

  itemCount$: Observable<number> = this.cartItems$.pipe(
    map(items => items.length)
  );
  totalQuantity$: Observable<number> = this.cartItems$.pipe(
    map(items => items.reduce((total, item) => total + item.quantity, 0))
  );
  taxPercent: number = 0.15;
  apiUrl = environment.apiURL;
  constructor(private http: HttpClient, private authService: AuthService) {
    this.initCart();
  }
  private initCart(): void {
    if (this.authService.isAuthenticated()) {
      const userId = this.authService.getCurrentUser()?.userId;
      this.getCartItems(userId).pipe(
        tap(dbCart => {
          this.syncLocalAndDb(dbCart);
        }),
        catchError(error => {
          this.loadFromLocalStorage();
          return of(null);
        })
      ).subscribe();
    } else {
      this.loadFromLocalStorage();
    }
  }

  /**
   * Gets the current cart items. Synchronous access.
   */
  getCurrentCartItems(): CartModel[] {
    return this._cartItemsSource.value;
  }

  /**
   * Adds an item to the cart, syncing with local storage and the database if authenticated.
   * @param cartItem The item to add.
   */
  addItem(cartItem: CartModel): void {
    const currentList = this.getCurrentCartItems();
    const existingItem = currentList.find(item => item.merchantItemId === cartItem.merchantItemId);

    let updatedList: CartModel[];

    if (existingItem) {
      // Update quantity of existing item
      updatedList = currentList.map(item =>
        item.merchantItemId === cartItem.merchantItemId
          ? { ...item, quantity: item.quantity + cartItem.quantity }
          : item
      );
    } else {
      // Add new item to the list with a dummy cartId for local storage
      const newItem: CartModel = { ...cartItem, cartId: new Date().getTime() }; // Temp ID for local use
      updatedList = [...currentList, newItem];
    }

    this._cartItemsSource.next(updatedList);
    this.saveToLocalStorage(updatedList);

    // Sync with API if user is authenticated
    if (this.authService.isAuthenticated()) {
      this.addItemToCart(cartItem).pipe(
        catchError(error => {
          console.error('Failed to add item to database.', error);
          // Optional: Revert local changes if sync fails.
          // For simplicity, we assume the API call will eventually work or the user will retry.
          return throwError(error);
        })
      ).subscribe();
    }
  }

  removeItem(merchantItemId: number): void {
    const updatedList = this.getCurrentCartItems().filter(item => item.merchantItemId != merchantItemId);

    this._cartItemsSource.next(updatedList);
    this.saveToLocalStorage(updatedList);
    if (this.authService.isAuthenticated()) {
      this.removeItemFromCart(merchantItemId).pipe(
        catchError(error => {
          console.error('Failed to remove item from database.', error);
          return throwError(error);
        })
      ).subscribe();
    }
  }

  clearCart(): void {
    this._cartItemsSource.next([]);
    this.saveToLocalStorage([]);

    if (this.authService.isAuthenticated()) {
      this.clearCartFromDB().pipe(
        catchError(error => {
          console.error('Failed to clear cart in database.', error);
          return throwError(error);
        })
      ).subscribe();
    }
  }

  // --- API Methods (Wrapper functions for clarity and error handling) ---

  private getCartItems(userId: string): Observable<CartModel[]> {
    //return this.http.get<Cart[]>(`${this.apiUrl}/Cart/${userId}`);
    return of([]);

  }

  private addItemToCart(cartItem: CartModel): Observable<ActionsResponseModel> {
    //return this.http.post<ActionsResponseModel>(`${this.apiUrl}/Cart`, cartItem);
    return of({ isSuccess: true, message: 'Item added successfully (temp response).' } as ActionsResponseModel);

  }

  private removeItemFromCart(cartId: number): Observable<ActionsResponseModel> {
    //return this.http.delete<ActionsResponseModel>(`${this.apiUrl}/Cart/${cartId}`);
    return of({ isSuccess: true, message: 'Item removed successfully (temp response).' } as ActionsResponseModel);
  }

  private clearCartFromDB(): Observable<ActionsResponseModel> {
    //return this.http.delete<ActionsResponseModel>(`${this.apiUrl}/Cart/clear`);
    return of({ isSuccess: true, message: 'Cart cleared successfully (temp response).' } as ActionsResponseModel);

  }
  private changeItemQuantityInDB(merchantItemId: number, quantity: number): Observable<ActionsResponseModel> {
    // return this.http.put<ActionsResponseModel>(`${this.apiUrl}/Cart/${merchantItemId}`, { quantity });
    return of({ isSuccess: true, message: 'Item quantity updated successfully (temp response).' } as ActionsResponseModel);
  }
  // --- Local Storage Sync Methods ---

  private loadFromLocalStorage(): void {
    try {
      const storedList = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      if (storedList) {
        const items: CartModel[] = JSON.parse(storedList);
        this._cartItemsSource.next(items);
      }
    } catch (e) {
      console.error('empty cart !', e);
      this._cartItemsSource.next([]);
    }
  }

  private saveToLocalStorage(list: CartModel[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Error saving cart to local storage', e);
    }
  }

  /**
   * Merges the DB cart with the local storage cart and sets the BehaviorSubject.
   * This is called only on the initial load for an authenticated user.
   */
  private syncLocalAndDb(dbCart: CartModel[]): void {
    const localCart: CartModel[] = this.loadFromLocalStorageAndReturn();

    // Simple sync: prioritize the DB cart
    const finalCart = dbCart.length > 0 ? dbCart : localCart;

    this._cartItemsSource.next(finalCart);
    this.saveToLocalStorage(finalCart);
  }

  // Helper method to load local storage without setting the subject
  private loadFromLocalStorageAndReturn(): CartModel[] {
    try {
      const storedList = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      return storedList ? JSON.parse(storedList) : [];
    } catch (e) {
      console.error('Error parsing local storage cart data', e);
      return [];
    }
  }

  isItemInList(itemId: number): boolean {
    return this._cartItemsSource.value.some(item => item.merchantItemId === itemId);
  }
  getItemQuantity(itemId: number): number {
    return this._cartItemsSource.value.find(item => item.merchantItemId === itemId)?.quantity;
  }

  changeItemQuantity(merchantItemId: number, newQuantity: number): void {
    if (newQuantity <= 0) {
      const itemToRemove = this.getCurrentCartItems().find(item => item.merchantItemId === merchantItemId);
      if (itemToRemove) {
        this.removeItem(merchantItemId);
      }
      return;
    }

    const updatedList = this.getCurrentCartItems().map(item =>
      item.merchantItemId === merchantItemId
        ? { ...item, quantity: newQuantity }
        : item
    );

    this._cartItemsSource.next(updatedList);
    this.saveToLocalStorage(updatedList);
    if (this.authService.isAuthenticated()) {
      this.changeItemQuantityInDB(merchantItemId, newQuantity).pipe(
        catchError(error => {
          console.error('Failed to update item quantity in database.', error);
          return throwError(error);
        })
      ).subscribe();
    }
  }

}
