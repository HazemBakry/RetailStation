import { Injectable } from "@angular/core";
import { MenuSidebarItem } from "../models/MenuSidebarItem";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  getMenuById(menuId: MenuType, subItemName: string = null): MenuSidebarItem {
    if (subItemName) {
      return this.menus.find(x => x.menuItemId == menuId)?.subMenus?.find(x => x.menuItem == subItemName);
    }
    return this.menus.find(x => x.menuItemId == menuId);
  }

  menus: MenuSidebarItem[] = [
    {
      menuItemId: MenuType.AdminHome,
      displayName: 'إدارة النظام',
      menuItem: 'Sales',
      subMenus:
        [
          {
            menuItemId: MenuType.AdminHome,
            displayName: 'لوحة التحكم',
            menuItem: '1',
            route: '/admin/home/1',
            icon: 'fa fa-gears',
            subMenus: [
              {
                displayName: 'الرئيسية',
                menuItem: 'dashboard',
                description: 'إحصائيات النظام',
                icon: 'fas fa-th-large',
                route: '/admin/home'
              },
              {
                displayName: 'المشتركين',
                menuItem: 'manage-subscriptions',
                description: 'بيانات المشتركين',
                icon: 'fas fa-th-large',
                route: '/admin/manage-subscriptions'
              },
              {
                displayName: 'طلبات الاشتراك',
                menuItem: 'merchant-requests',
                description: 'طلبات الاشتراك',
                icon: 'fas fa-th-large',
                route: '/admin/merchant-requests'
              },
              {
                displayName: 'صلاحيات المشتركين',
                menuItem: '',
                description: 'صلاحيات المشتركين والمستخدمين',
                icon: 'fas fa-th-large',
                route: '/admin/roles'
              },
              {
                displayName: 'الاقسام',
                menuItem: 'items-categories',
                description: 'إدارة الاقسام',
                icon: 'fa fa-tags',
                route: '/admin/items-categories'
              },
              {
                displayName: 'إدارة بيانات الأصناف',
                menuItem: 'items',
                description: 'الأصناف داخل المخازن',
                icon: 'fa fa-layer-group',
                route: '/admin/items'
              },
              {
                displayName: 'قائمة التجار',
                menuItem: 'merchants',
                description: 'إدارة بيانات التجار وتفاصيل الاتصال',
                icon: 'fa fa-users',
                route: '/admin/merchants'
              },
              {
                displayName: 'قائمة الدول',
                menuItem: 'countries',
                icon: 'fa fa-users',
                route: '/admin/countries'
              },
              {
                displayName: 'قائمة المدن',
                menuItem: 'cities',
                icon: 'fa fa-users',
                route: '/admin/cities'
              },
              {
                displayName: 'قائمة المناطق',
                menuItem: 'regions',
                icon: 'fa fa-users',
                route: '/admin/regions'
              },
              {
                displayName: 'أفضل الأصناف مبيعاً',
                menuItem: 'best-seller-items',
                icon: 'fa fa-users',
                route: '/admin/best-seller-items'
              },
              {
                displayName: 'أفضل الشركاء',
                menuItem: 'top-partners',
                icon: 'fa fa-users',
                route: '/admin/top-partners'
              },
              {
                displayName: 'قائمة الخصومات',
                menuItem: 'promotions',
                icon: 'fa fa-users',
                route: '/admin/promotions'
              },
            ]
          },

        ]
    },
    {
      menuItemId: MenuType.MainModules,
      displayName: 'الصفحة الرئيسية',
      menuItem: 'MainModules',
      subMenus: [
        {
          displayName: 'الحسابات العامة',
          menuItem: 'GeneralAccounts',
          description: 'الوصول إلى إدارة الحسابات والقيود والتقارير المالية',
          icon: 'fa-solid fa-book',
          route: '/general-accounts'
        },
        {
          displayName: 'المخازن',
          menuItem: 'Inventory',
          description: 'إدارة المخزون ومتابعة العمليات المخزنية',
          icon: 'fa-solid fa-warehouse',
          route: '/inventory'
        },
        {
          displayName: 'المشتريات',
          menuItem: 'Purchases',
          description: 'إدارة عمليات الشراء من الموردين والفواتير المرتبطة بها',
          icon: 'fa-solid fa-cart-shopping',
          route: '/purchases'
        },
        // {
        //   displayName: 'المبيعات',
        //   menuItem: 'merchant',
        //   description: 'إدارة عمليات البيع والفواتير الخاصة بالعملاء',
        //   icon: 'fa-solid fa-store',
        //   route: '/merchant'
        // },
        {
          displayName: 'الموارد البشرية',
          menuItem: 'HR',
          description: 'إدارة الموظفين والرواتب وسجلات الموارد البشرية',
          icon: 'fa-solid fa-user-group',
          route: '/hr'
        },
        {
          displayName: 'إعدادات النظام',
          menuItem: 'SystemSettings',
          description: 'تهيئة النظام وضبط الإعدادات العامة',
          icon: 'fa-solid fa-gears',
          route: '/system-settings'
        }
      ]
    },
    {
      menuItemId: MenuType.UserHome,
      displayName: 'لوحة التحكم',
      menuItem: 'Purchases',
      subMenus:
        [
          {
            menuItemId: MenuType.UserHome,
            displayName: 'إدارة طلباتى',
            menuItem: '1',
            route: '/purchases/home/1',
            icon: 'fa fa-shopping-cart',
            subMenus: [
              {
                displayName: 'لوحة التحكم',
                menuItem: 'dashboard',
                description: 'متابعة احصائيات المشتريات',
                icon: 'fa-th-large fas',
                route: '/purchases/dashboard'
              },
              {
                displayName: 'قائمة الطلبات',
                menuItem: 'purchase-orders',
                description: 'متابعة وإدارة قائمة طلبات المشتريات',
                icon: 'ph ph-shopping-cart',
                route: '/purchases/purchase-orders'
              },
            ]
          },
        ]
    },

    {
      menuItemId: MenuType.MerchantHome,
      displayName: 'لوحة تحكم التاجر',
      menuItem: 'Merchant',
      subMenus:
        [
          {
            menuItemId: MenuType.MerchantHome,
            displayName: 'إدارة المبيعات',
            menuItem: '1',
            route: '/merchant/home/1',
            icon: 'fa fa-shopping-cart',
            subMenus: [
              {
                displayName: 'لوحة التحكم',
                menuItem: 'dashboard',
                description: 'متابعة احصائيات المبيعات',
                icon: 'fa fa-clipboard-list',
                route: '/merchant/dashboard'
              },
              {
                displayName: 'قائمة الطلبات',
                menuItem: 'orders',
                description: 'متابعة وإدارة قائمة الطلبات',
                icon: 'fa fa-clipboard-list',
                route: '/merchant/merchant-orders'
              },
              // {
              //   displayName: 'مرتجعات المبيعات',
              //   menuItem: 'merchant-returns',
              //   description: 'معالجة وإدارة المرتجعات على المبيعات',
              //   icon: 'fa fa-undo-alt',
              //   route: '/merchant/merchant-returns'
              // },
              {
                displayName: 'العروض',
                menuItem: 'promotions',
                description: 'إدارة العروض والخصومات',
                icon: 'fa fa-tags',
                route: '/merchant/merchant-promotions'
              },
              {
                displayName: 'بيانات الأصناف',
                menuItem: 'items',
                description: 'إضافة و تعديل بيانات الأصناف',
                icon: 'fa fa-clipboard-list',
                route: '/merchant/merchant-items'
              },
              {
                displayName: 'بيانات التاجر',
                menuItem: 'merchant-profile',
                description: 'تعديل بيانات التاجر ',
                icon: 'fa fa-file-alt',
                route: '/merchant/merchant-profile'
              },
              {
                displayName: 'قائمة الفروع',
                menuItem: 'branches',
                description: 'تعديل بيانات الفروع ',
                icon: 'fa fa-file-alt',
                route: '/merchant/merchant-branches'
              },
              // {
              //   displayName: 'كشف حساب العملاء',
              //   menuItem: 'customers-statement',
              //   description: 'عرض جميع العمليات الخاصة بالموردين',
              //   icon: 'fa fa-file-alt',
              //   route: '/merchant/customers-statement'
              // },
              // {
              //   displayName: 'اشعارات خصم للعملاء',
              //   menuItem: 'customer-returns-voucher',
              //   description: 'إصدار إشعارات الخصم لمشتريات العملاء',
              //   icon: 'fa fa-receipt',
              //   route: '/merchant/customer-returns-voucher'
              // }
            ]
          },
          // {
          //   menuItemId: MenuType.InventoryHome,
          //   displayName: 'التهيئة والاعدادات',
          //   menuItem: '2',
          //   route: '/purchases/home/2',
          //   icon: 'fa fa-database',
          //   subMenus: [
          //     {
          //       displayName: 'بيانات الأصناف',
          //       menuItem: 'items',
          //       description: 'إضافة و تعديل بيانات الأصناف',
          //       icon: 'fa fa-clipboard-list',
          //       route: '/merchant/items'
          //     },
          //     {
          //       displayName: 'مجموعات الأصناف',
          //       menuItem: 'items-categories',
          //       description: 'إدارة بيانات الموردين وتفاصيل الاتصال',
          //       icon: 'fa fa-clipboard-list',
          //       route: '/merchant/items-categories'
          //     },
          //     {
          //       displayName: 'أنواع فواتير المشتريات',
          //       menuItem: 'purchase-invoice-types',
          //       description: 'إدارة بيانات أنواع الفواتير وتفاصيل الحسابات',
          //       icon: 'fa fa-users',
          //       route: '/purchases/purchase-invoice-types'
          //     }
          //   ]
          // }
        ]
    },
    // {
    //   menuItemId: MenuType.AdminHome,
    //   displayName: 'الاعدادات',
    //   menuItem: '1',
    //   route: '/system-settings/home/1',
    //   icon: 'fa fa-warehouse',
    //   subMenus: [
    //     {
    //       displayName: 'لوحة التحكم',
    //       menuItem: 'dashboard',
    //       description: 'إنشاء وتتبع طلبات شراء المواد من المخازن',
    //       icon: 'fa fa-file-signature',
    //       route: '/system-settings/dashboard'
    //     },
    //     {
    //       displayName: 'بيانات الفروع',
    //       menuItem: 'branches',
    //       description: 'تعريف وتصنيف بيانات الفروع',
    //       icon: 'fa fa-layer-group',
    //       route: '/system-settings/branches'
    //     },
    //     {
    //       displayName: 'بيانات المستخدمين',
    //       menuItem: 'system-users',
    //       description: 'تعريف وتصنيف بيانات المستخدمين',
    //       icon: 'fa fa-layer-group',
    //       route: '/system-settings/system-users'
    //     },
    //     {
    //       displayName: 'صلاحيات المستخدمين',
    //       menuItem: 'roles',
    //       description: 'إدارة صلاحيات المستخدمين',
    //       icon: 'fa fa-cogs',
    //       route: '/system-settings/roles'
    //     },
    //   ]
    // }
  ];
}
export enum MenuType {
  GeneralAccountsHome = 1,
  MainModules,
  MerchantHome,
  UserHome,
  AdminHome,
  Admin

}
