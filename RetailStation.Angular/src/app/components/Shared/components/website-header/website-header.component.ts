import { Component, EventEmitter, HostListener, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { LoginUserModel } from '../../models/LoginResponseModel';
import { MenuSidebarItem } from '../../models/MenuSidebarItem';
import { AuthService } from 'src/app/Auth/auth.service';
import { MenuService, MenuType } from '../../services/menu.service';
import { environment } from 'src/environments/environment';
import { CompareService } from '../../services/comapre.service';
import { CartService } from '../../services/cart.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-website-header',
  templateUrl: './website-header.component.html',
  styleUrls: ['./website-header.component.css', '../../../../../styles-website.css']
})
export class WebsiteHeaderComponent implements OnInit {

  @Input() showToggler: boolean = true;
  @Output() toggler = new EventEmitter<boolean>();
  collapsed = true;
  showMenu: boolean = false;
  systemUrl: string = environment.systemUrl;
  productSystemUrl: string = environment.authServerUrl + '/products';
  UserModel: LoginUserModel;
  selectedModuleName: string = 'الأنظمة';
  modulesMenu: MenuSidebarItem[] = [];
  isAuthenticated: boolean = false;
  cartItemsCount$: number = 0;

  constructor(private authService: AuthService, private router: Router,
    private menuService: MenuService, private cartService: CartService,
    private modalService: NgbModal) {
    this.modulesMenu = this.menuService.getMenuById(MenuType.MainModules)?.subMenus;
    this.UserModel = this.authService.getCurrentUser();
    this.isAuthenticated = this.authService.isAuthenticated();
    this.routerSubscriber();
    this.getCartItemsNumber(); this.getUserModel();
    this.cartService.itemCount$.subscribe(count => {
      this.cartItemsCount$ = count || 0;
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

  getUserModel() {
    // this.sharedService.CurrentUserModel.subscribe(data => {
    //   this.UserModel = data;
    //   this.isUserDropdown = false;
    // });
  }


  onClickedOutside() {
    this.isUserDropdown = false;
  }

  @HostListener('window:scroll') onScroll() {
    let windowScroll = window.scrollY;
    let windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    this.scrollWidth = (windowScroll / windowHeight) * 100;
  }



  routerSubscriber() {
    this.setSelectedModule(this.router.url);

    this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe((event: NavigationStart) => {
      this.setSelectedModule(event.url);
    });
  }
  setSelectedModule(url: string) {
    var selectedModule = url.split('/') ? url.split('/')[1] : '';
    if (selectedModule) {
      this.selectedModuleName = this.modulesMenu.find(x => x.route == `/${selectedModule}`)?.displayName;
    }
  }
  onToggler() {
    this.showMenu = !this.showMenu;
    // this.toggler.emit();
  }
  logout() {
    this.authService.logout();
  }
  login() {
    this.authService.loginRedirect();
  }


}
