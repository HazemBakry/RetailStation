import { Component, Input, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { CompareService } from 'src/app/components/Shared/services/comapre.service';
import { environment } from 'src/environments/environment';
import {
  CartModel,
  CartService,
} from 'src/app/components/Shared/services/cart.service';
import { MerchantItemModel } from 'src/app/components/Shared/models/MerchantItemModel';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Auth/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  isItemInCart = false;
  systemURL: string = environment.systemUrl;
  isCounterMode = false;

  constructor(
    config: NgbCarouselConfig,
    private compareService: CompareService,
    private cartService: CartService,
    private toaster: ToastrService
  ) {
    config.interval = 5000;
    config.wrap = true;
    config.keyboard = true;
    config.pauseOnHover = false;
  }
  ngOnInit(): void {

  }


}
