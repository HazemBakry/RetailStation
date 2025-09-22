import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { ActionsResponseModel } from '../models/ActionsResponseModel';
import { AuthService } from 'src/app/Auth/auth.service';

export interface CartModel {
  supplierItemId: number;
  quantity: number;
  userId: string;
}

export interface Cart {
  cartId: number;
  supplierItemId: number;
  quantity: number;
  userId: string;
}

const LOCAL_STORAGE_CART_KEY = 'cartItems';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private _cartItemsSource = new BehaviorSubject<Cart[]>([]);

  cartItems$: Observable<Cart[]> = this._cartItemsSource.asObservable();

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
  getCurrentCartItems(): Cart[] {
    return this._cartItemsSource.value;
  }

  /**
   * Adds an item to the cart, syncing with local storage and the database if authenticated.
   * @param cartItem The item to add.
   */
  addItem(cartItem: CartModel): void {
    const currentList = this.getCurrentCartItems();
    const existingItem = currentList.find(item => item.supplierItemId === cartItem.supplierItemId);

    let updatedList: Cart[];

    if (existingItem) {
      // Update quantity of existing item
      updatedList = currentList.map(item =>
        item.supplierItemId === cartItem.supplierItemId
          ? { ...item, quantity: item.quantity + cartItem.quantity }
          : item
      );
    } else {
      // Add new item to the list with a dummy cartId for local storage
      const newItem: Cart = { ...cartItem, cartId: new Date().getTime() }; // Temp ID for local use
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

  /**
   * Removes an item from the cart, syncing with local storage and the database.
   * @param cartId The database cartId of the item to remove.
   */
  removeItem(cartId: number): void {
    const updatedList = this.getCurrentCartItems().filter(item => item.cartId !== cartId);

    this._cartItemsSource.next(updatedList);
    this.saveToLocalStorage(updatedList);

    // Sync with API if item has a real DB ID
    if (this.authService.isAuthenticated()) {
      this.removeItemFromCart(cartId).pipe(
        catchError(error => {
          console.error('Failed to remove item from database.', error);
          return throwError(error);
        })
      ).subscribe();
    }
  }

  /**
   * Clears all items from the cart, syncing with local storage and the database.
   */
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

  private getCartItems(userId: string): Observable<Cart[]> {
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

  // --- Local Storage Sync Methods ---

  private loadFromLocalStorage(): void {
    try {
      const storedList = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      if (storedList) {
        const items: Cart[] = JSON.parse(storedList);
        this._cartItemsSource.next(items);
      }
    } catch (e) {
      console.error('empty cart !', e);
      this._cartItemsSource.next([]);
    }
  }

  private saveToLocalStorage(list: Cart[]): void {
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
  private syncLocalAndDb(dbCart: Cart[]): void {
    const localCart: Cart[] = this.loadFromLocalStorageAndReturn();

    // Simple sync: prioritize the DB cart
    const finalCart = dbCart.length > 0 ? dbCart : localCart;

    this._cartItemsSource.next(finalCart);
    this.saveToLocalStorage(finalCart);
  }

  // Helper method to load local storage without setting the subject
  private loadFromLocalStorageAndReturn(): Cart[] {
    try {
      const storedList = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      return storedList ? JSON.parse(storedList) : [];
    } catch (e) {
      console.error('Error parsing local storage cart data', e);
      return [];
    }
  }
  // getCartItems(userId: string): Observable<Cart[]> {
  //   return this.http.get<Cart[]>(`${this.apiUrl}/Cart/${userId}`);
  // }


  // addItemToCart(cartItem: CartModel): Observable<ActionsResponseModel> {
  //   return this.http.post<ActionsResponseModel>(`${this.apiUrl}/Cart`, cartItem);
  // }

  // removeItemFromCart(cartId: number): Observable<ActionsResponseModel> {
  //   return this.http.delete<ActionsResponseModel>(`${this.apiUrl}/Cart/${cartId}`);
  // }
  // clearCart(userId: string): Observable<ActionsResponseModel> {
  //   return this.http.delete<ActionsResponseModel>(`${this.apiUrl}/Cart/clear/${userId}`);
  // }

}
