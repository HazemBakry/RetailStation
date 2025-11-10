import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';
import { AuthService } from 'src/app/Auth/auth.service';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginUserModel, MerchantRegistrationModel } from 'src/app/components/Shared/models/LoginResponseModel';
import { MenuSidebarItem } from 'src/app/components/Shared/models/MenuSidebarItem';
import { MenuService, MenuType } from 'src/app/components/Shared/services/menu.service';
import { CartService } from 'src/app/components/Shared/services/cart.service';
import { FormGroup } from '@angular/forms';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { ToastrService } from 'ngx-toastr';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';

@Component({
  selector: 'app-website-header',
  templateUrl: './website-header.component.html',
  styleUrls: ['./website-header.component.css', '../../../../../styles-website.css'],
})
export class WebsiteHeaderComponent implements OnInit {
  @Input() showToggler: boolean = true;
  @Output() toggler = new EventEmitter<boolean>();
  collapsed = true;
  showMenu: boolean = false;
  systemUrl: string = environment.systemUrl;
  defaultImage: string = `${environment.systemUrl}${environment.defaultImage}`;
  //productSystemUrl: string = environment.authServerUrl + '/products';
  UserModel: LoginUserModel;
  selectedModuleName: string = 'الأنظمة';
  modulesMenu: MenuSidebarItem[] = [];
  isAuthenticated: boolean = false;
  cartItemsCount$: number = 0;
  userName: string = '';
  password: string = '';
  isLoginMode = true;

  showLoader: boolean = false;
  subscriberModel: MerchantRegistrationModel = {} as MerchantRegistrationModel;
  formData: FormData = new FormData();
  public formGroup: FormGroup;

  isAuthenticatedSubject = new BehaviorSubject<boolean>(this.authService.isAuthenticated());

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private readonly USER_MODEL = 'USER_MODEL';
  public readonly VIEW_ACTION_NAME: string = 'View';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toaster: ToastrService,
    private menuService: MenuService,
    private cartService: CartService,
    private modalService: NgbModal,
    private formService: FormService,
  ) {
    this.modulesMenu = this.menuService.getMenuById(
      MenuType.MainModules
    )?.subMenus;
    this.UserModel = this.authService.getCurrentUser();
    this.isAuthenticated = this.authService.isAuthenticated();
    this.routerSubscriber();
    this.getCartItemsNumber();
    this.cartService.itemCount$.subscribe((count) => {
      this.cartItemsCount$ = count || 0;
    });
  }

  openLoginRegisterModal(content: TemplateRef<any>) {
    this.modalService.open(content, {
      size: 'md',
      centered: true,
      scrollable: true,
    });
  }

  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, {
      size: 'xl',
      centered: true,
      scrollable: true,
    });
  }

  CartItemsList: any;
  isMenuOpen = false;
  UserModelStr: any;

  isUserDropdown = false;

  scrollWidth: number = 0;
  ngOnInit(): void {
    this.CartItemsList = [];
  }

  getCartItemsNumber() {
    // this.sharedService.CurrentCartNumber.subscribe(data => {
    //   this.CartItemsList = data;
    // });
  }



  onClickedOutside() {
    this.isUserDropdown = false;
  }

  @HostListener('window:scroll') onScroll() {
    let windowScroll = window.scrollY;
    let windowHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    this.scrollWidth = (windowScroll / windowHeight) * 100;
  }

  routerSubscriber() {
    this.setSelectedModule(this.router.url);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        this.setSelectedModule(event.url);
      });
  }

  setSelectedModule(url: string) {
    var selectedModule = url.split('/') ? url.split('/')[1] : '';
    if (selectedModule) {
      this.selectedModuleName = this.modulesMenu.find(
        (x) => x.route == `/${selectedModule}`
      )?.displayName;
    }
  }

  onToggler() {
    this.showMenu = !this.showMenu;
    // this.toggler.emit();
  }

  logout() {
    this.authService.logout();
    // this.clearStorage();
    // this.isAuthenticatedSubject.next(false);
    // window.location.href = '/';
  }

  // login() {
  //   this.authService.login();
  // }



  register() {
    this.showLoader = true;
    this.authService.register(this.subscriberModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.toaster.success(data?.message);
        this.authService.loginRedirect();
      }
      else {
        this.toaster.error(data?.message);
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  validateForm(): boolean {
    this.formService.markFormGroupTouched(this.formGroup);
    if (this.formGroup.valid) {
      return true;
    } else {
      this.formErrors = this.formService.validateForm(this.formGroup, this.formErrors, false)
      return false;
    }
  }

  clearStorage(): void {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    localStorage.removeItem(this.USER_MODEL);
    localStorage.clear();
  }

  public formErrors = {
    firstName: '',
    lastName: '',
    userName: '',
    password: '',
    email: '',
    phoneNumber: '',
    subscriberTypeId: '',
    address: '',
    subscriberName: '',
    subscriberEmail: '',
    subscriberId: ''
  };








  isBurgerOpen = false;
  openSubmenu: string | null = null;
  hoveredMenu: string | null = null;
  selectedCity = 'القاهرة';
  selectedCountry = 'مصر 🇪🇬';
  searchText = '';

  cities = ['القاهرة', 'الرياض', 'دبي'];
  countries = ['مصر 🇪🇬', 'الكويت 🇰🇼', 'قطر 🇶🇦', 'الإمارات 🇦🇪'];

  toggleBurger() {
    this.isBurgerOpen = !this.isBurgerOpen;
  }

  closeBurger() {
    this.isBurgerOpen = false;
    this.openSubmenu = null;
  }

  toggleSubmenu(menu: string) {
    this.openSubmenu = this.openSubmenu === menu ? null : menu;
  }

  hoverSubmenu(menu: string | null) {
    this.hoveredMenu = menu;
  }

  selectCountry(country: string) {
    this.selectedCountry = country;
    this.openSubmenu = null;
  }
}
