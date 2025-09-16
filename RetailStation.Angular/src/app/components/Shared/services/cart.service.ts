import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { CustomerModel } from '../../GeneralAccounts/models/GeneralAccounts/CustomerModel';
import { ExcelExportStyle } from '../Enums/ImporterTemplateEnum';
import { ActionsResponseModel } from '../models/ActionsResponseModel';
import { FormControl, FormGroup } from '@angular/forms';
import { GeneralSelectorModel } from '../components/general-selector/general-selector.component';
import { FinancialPeriodModel } from '../../GeneralAccounts/models/FinancialPeriodModel';
import { AccountTypeEnum } from '../Enums/AccountTypeEnum';
import { AuthService } from 'src/app/Auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  taxPercent: number = 0.15;
  apiUrl = environment.apiURL;

  constructor(private http: HttpClient, private authSe: AuthService) {

  }

  getCartItems(userId: string): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.apiUrl}/Cart/${userId}`);
  }


  addItemToCart(cartItem: CartModel): Observable<ActionsResponseModel> {
    return this.http.post<ActionsResponseModel>(`${this.apiUrl}/Cart`, cartItem);
  }

  removeItemFromCart(cartId: number): Observable<ActionsResponseModel> {
    return this.http.delete<ActionsResponseModel>(`${this.apiUrl}/Cart/${cartId}`);
  }
  clearCart(userId: string): Observable<ActionsResponseModel> {
    return this.http.delete<ActionsResponseModel>(`${this.apiUrl}/Cart/clear/${userId}`);
  }

}


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