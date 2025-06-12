import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AuthService } from 'src/app/Auth/auth.service';
import { environment } from 'src/environments/environment';
import { LoginUserModel } from '../../Shared/models/LoginResponseModel';
import { ActivatedRoute, NavigationStart, Route, Router } from '@angular/router';
import { filter } from 'rxjs';
import { MenuService, MenuType } from '../../Shared/services/menu.service';
import { MenuSidebarItem } from '../../Shared/models/MenuSidebarItem';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() showToggler: boolean = true;
  @Output() toggler = new EventEmitter<boolean>();
  collapsed = true;
  showMenu: boolean = false;
  systemUrl: string = environment.systemUrl;
  productSystemUrl: string = environment.authServerUrl+'/products';
  UserModel: LoginUserModel;
  selectedModuleName : string = 'الأنظمة';
  modulesMenu:MenuSidebarItem[] = [];
  constructor(private authService: AuthService, private router: Router,private menuService: MenuService) {
        this.modulesMenu = this.menuService.getMenuById(MenuType.MainModules)?.subMenus;
    this.UserModel = this.authService.getCurrentUser();
    this.routerSubscriber();
  }

  ngOnInit(): void {
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
      this.selectedModuleName = this.modulesMenu.find(x => x.route ==`/${selectedModule}`)?.displayName;
    }
  }
  onToggler() {
    this.showMenu = !this.showMenu;
    // this.toggler.emit();
    console.log(this.toggler);
  }
  logout() {
    this.authService.logout();
  }



}
