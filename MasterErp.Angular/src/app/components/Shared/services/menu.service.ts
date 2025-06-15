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
      menuItemId: MenuType.GeneralAccountsHome,
      displayName: 'الحسابات العامة',
      menuItem: 'GeneralAccounts',
      subMenus: [
        {
          menuItemId: MenuType.GeneralAccountsHome,
          displayName: 'لوحة التحكم',
          menuItem: '',
          description: 'احصائيات عن القيود والسندات',
          icon: 'fas fa-th-large',
          route: '/general-accounts/home'
        },
        {
          menuItemId: MenuType.GeneralAccountsHome,
          displayName: 'الادلة',
          menuItem: '1',
          description: 'الوصول إلى شجرة الحسابات ومراكز التكلفة',
          icon: 'fa-solid fa-sitemap',
          route: '/general-accounts/home/1',
          subMenus: [
            {
              displayName: 'شجرة الحسابات',
              menuItem: 'AccountTree',
              description: 'عرض وتصميم هيكل الحسابات المالية',
              icon: 'fa fa-sitemap',
              route: '/general-accounts/account-tree'
            },
            {
              displayName: 'مراكز التكلفة',
              menuItem: 'CostCenter',
              description: 'إدارة وإنشاء مراكز التكلفة وربطها بالعمليات',
              icon: 'fa fa-project-diagram',
              route: '/general-accounts/cost-center-tree'
            },
          ]
        },
        {
          menuItemId: MenuType.GeneralAccountsHome,
          displayName: 'العمليات المالية',
          menuItem: '2',
          description: 'إجراء المعاملات اليومية مثل القيود والسندات',
          icon: 'fa-solid fa-exchange-alt',
          route: '/general-accounts/home/2',
          subMenus: [
            {
              displayName: 'سجل القيود اليومية',
              menuItem: 'journal-daily-list',
              description: 'تتبع وإدارة القيود اليومية المحاسبية',
              icon: 'fa fa-book',
              route: '/general-accounts/journal-daily-list'
            },
            {
              displayName: 'أوامر الصرف',
              menuItem: 'payment-orders',
              description: 'إصدار وتتبع أوامر صرف نقدية',
              icon: 'fa fa-money-check-alt',
              route: '/general-accounts/payment-orders'
            },
            {
              displayName: 'سندات الصرف',
              menuItem: 'payment-receipts',
              description: 'إدارة وتوثيق عمليات الصرف النقدي',
              icon: 'fa fa-file-invoice-dollar',
              route: '/general-accounts/payment-receipts'
            },
            {
              displayName: 'سندات القبض',
              menuItem: 'receive-receipts',
              description: 'توثيق واستلام المبالغ النقدية الواردة',
              icon: 'fa fa-receipt',
              route: '/general-accounts/receive-receipts'
            },
            // {
            //   displayName: 'الرصيد الافتتاحي',
            //   menuItem: 'opening-balance',
            //   description: 'تحديد الأرصدة الافتتاحية للفترة المحاسبية',
            //   icon: 'fa fa-balance-scale-left',
            //   route: '/general-accounts/opening-balance'
            // },
            {
              displayName: 'القروض',
              menuItem: 'loans',
              description: 'إدارة القروض والمبالغ الممولة',
              icon: 'fa fa-hand-holding-usd',
              route: '/general-accounts/loans'
            },
            {
              displayName: 'طلبات السلف',
              menuItem: 'advances-requests',
              description: 'إرسال وتتبع طلبات السلف المالية',
              icon: 'fa fa-file-signature',
              route: '/general-accounts/advances-requests'
            },
          ]
        },
        {
          menuItemId: MenuType.GeneralAccountsHome,
          displayName: 'تقارير مالية',
          menuItem: '3',
          description: 'عرض وتحليل التقارير المالية الأساسية',
          icon: 'fa-solid fa-file-invoice-dollar',
          route: '/general-accounts/home/3',
          subMenus: [
            {
              displayName: 'الأستاذ العام',
              menuItem: 'accounts-general-ledger',
              description: 'عرض حركة الحسابات العامة',
              icon: 'fa fa-book-open',
              route: '/general-accounts/accounts-general-ledger'
            },
            {
              displayName: 'الأستاذ العام المساعد',
              menuItem: 'accounts-assistant-ledger',
              description: 'تفاصيل الأستاذ المساعد حسب الحسابات',
              icon: 'fa fa-layer-group',
              route: '/general-accounts/accounts-assistant-ledger'
            },
            {
              displayName: 'ميزان المراجعة',
              menuItem: 'trial-balance',
              description: 'عرض ميزان مراجعة الحسابات',
              icon: 'fa fa-scale-balanced',
              route: '/general-accounts/trial-balance'
            },
            {
              displayName: 'الأستاذ المساعد الشهرى',
              menuItem: 'monthly-assistant-ledger',
              description: 'تحليل شهري للأستاذ المساعد',
              icon: 'fa fa-calendar-alt',
              route: '/general-accounts/monthly-assistant-ledger'
            },
            {
              displayName: 'المركز المالى',
              menuItem: 'balance-sheet',
              description: 'عرض الوضع المالي العام (الميزانية)',
              icon: 'fa fa-chart-line',
              route: '/general-accounts/balance-sheet'
            },
          ]
        },
        // {
        //   menuItemId: MenuType.GeneralAccountsHome,
        //   displayName: 'الحسابات الختامية',
        //   menuItem: '4',
        //   description: 'متابعة وإنهاء الحسابات الختامية',
        //   icon: 'fa-solid fa-clipboard-check',
        //   route: '/general-accounts/home/4',

        //   subMenus: [
        //     {
        //       displayName: 'الحسابات الختامية',
        //       menuItem: 'accounts-general-ledger',
        //       description: 'عرض وتحليل الحسابات الختامية',
        //       icon: 'fa fa-clipboard-check',
        //     },
        //     {
        //       displayName: 'الحسابات الختامية',
        //       menuItem: 'accounts-general-ledger',
        //       description: 'تحليل تفصيلي للحسابات الختامية',
        //       icon: 'fa fa-clipboard-check',
        //     },
        //   ]
        // },
        {
          menuItemId: MenuType.GeneralAccountsHome,
          displayName: 'تقارير مراكز التكلفة',
          menuItem: '5',
          description: 'تحليل أداء مراكز التكلفة المختلفة',
          icon: 'fa-solid fa-project-diagram',
          route: '/general-accounts/home/5',

          subMenus: [
            {
              displayName: 'الأستاذ العام - مراكز التكلفة',
              menuItem: 'cost-general-ledger',
              description: 'عرض الأستاذ العام حسب مراكز التكلفة',
              icon: 'fa fa-stream',
              route: '/general-accounts/cost-general-ledger'
            },
            {
              displayName: 'الأستاذ المساعد - مراكز التكلفة',
              menuItem: 'cost-assistant-ledger',
              description: 'عرض مفصل للأستاذ المساعد لمراكز التكلفة',
              icon: 'fa fa-th-list',
              route: '/general-accounts/cost-assistant-ledger'
            },
            {
              displayName: 'ميزان مراجعة مراكز التكلفة',
              menuItem: 'cost-trial-balance',
              description: 'عرض ميزان مراجعة خاص بمراكز التكلفة',
              icon: 'fa fa-scale-unbalanced',
              route: '/general-accounts/cost-trial-balance'
            },
            {
              displayName: 'مصفوفة مراكز التكلفة',
              menuItem: 'cost-center-matrix',
              description: 'تحليل مرئي وهيكلي لمراكز التكلفة',
              icon: 'fa fa-th',
              route: '/general-accounts/cost-center-matrix'
            },
          ]
        },
        {
          menuItemId: MenuType.GeneralAccountsHome,
          displayName: 'العملاء',
          menuItem: '6',
          description: 'إدارة بيانات العملاء وحركاتهم المالية',
          icon: 'fa-solid fa-users',
          route: '/general-accounts/home/6',

          subMenus: [
            {
              displayName: 'العملاء',
              menuItem: 'customers',
              description: 'إدارة بيانات العملاء ومعلوماتهم المالية',
              icon: 'fa fa-user-friends',
              route: '/general-accounts/customers'
            },
            {
              displayName: 'الدفعات',
              menuItem: 'batches',
              description: 'عرض وإدارة دفعات العملاء',
              icon: 'fa fa-credit-card',
              route: '/general-accounts/batches'
            },
          ]
        },
        {
          menuItemId: MenuType.GeneralAccountsHome,
          displayName: 'التهيئة والاعدادات',
          menuItem: '7',
          description: 'تهيئة القوالب والسنة المالية والإعدادات المحاسبية',
          icon: 'fa-solid fa-tools',
          route: '/general-accounts/home/7',

          subMenus: [
            {
              displayName: 'قوالب القيود',
              menuItem: 'journal-entry-templates',
              description: 'إنشاء وتعديل قوالب القيود المحاسبية',
              icon: 'fa fa-file-alt',
              route: '/general-accounts/journal-entry-templates'
            },
            {
              displayName: 'السنة المالية',
              menuItem: 'financial-period',
              description: 'تحديد فترة السنة المالية للنظام',
              icon: 'fa fa-calendar',
              route: '/general-accounts/financial-period'
            },
            {
              displayName: 'دفاتر الايصال',
              menuItem: 'receipt-ledgers',
              description: 'إدارة دفاتر سندات القبض والصرف',
              icon: 'fa fa-book-open',
              route: '/general-accounts/receipt-ledgers'
            },
            {
              displayName: 'شروط السداد',
              menuItem: 'payment-terms',
              description: 'تحديد آليات وشروط الدفع',
              icon: 'fa fa-handshake',
              route: '/general-accounts/payment-terms'
            },
            {
              displayName: 'حساب الضريبة',
              menuItem: 'tax-calculation',
              description: 'إعداد طرق حساب وتطبيق الضريبة',
              icon: 'fa fa-percentage',
              route: '/general-accounts/tax-calculation'
            },
            {
              displayName: 'الدفاتر اليومية',
              menuItem: 'daily-notebook',
              description: 'إعداد دفاتر اليومية المختلفة',
              icon: 'fa fa-book',
              route: '/general-accounts/daily-notebook'
            },
            {
              displayName: 'نماذج الأصول',
              menuItem: 'receipt-ledgers',
              description: 'إدارة نماذج وإثباتات الأصول',
              icon: 'fa fa-warehouse',
              route: '/general-accounts/receipt-ledgers'
            },
            {
              displayName: 'أنواع الدفاتر اليومية',
              menuItem: 'ledger-journal-types',
              description: 'تصنيف أنواع دفاتر اليومية المحاسبية',
              icon: 'fa fa-layer-group',
              route: '/general-accounts/ledger-journal-types'
            },
          ]
        },
        {
          menuItemId: MenuType.GeneralAccountsHome,
          displayName: 'التقارير',
          menuItem: '9',
          description: 'عرض تقارير الميزانية والتدفقات النقدية',
          icon: 'fa-solid fa-chart-pie',
          route: '/general-accounts/home/9',

          subMenus: [
            {
              displayName: 'الميزانية العمومية',
              menuItem: 'journal-entry-templates',
              description: 'عرض وتحليل المركز المالي العام',
              icon: 'fa fa-file-invoice',
            },
            {
              displayName: 'كشف التدفقات النقدية',
              menuItem: 'journal-entry-templates',
              description: 'تحليل حركة التدفقات النقدية',
              icon: 'fa fa-water',
            },
            {
              displayName: 'الإقرار الضريبي',
              menuItem: 'journal-entry-templates',
              description: 'إعداد وتقديم الإقرار الضريبي',
              icon: 'fa fa-file-contract',
            },
            {
              displayName: 'دفتر الأستاذ العام للشركاء',
              menuItem: 'journal-entry-templates',
              description: 'عرض الحركات المالية لشركاء النظام',
              icon: 'fa fa-users',
            },
            {
              displayName: 'تدقيق دفتر اليومية',
              menuItem: 'journal-entry-templates',
              description: 'مراجعة وتدقيق كافة الحركات اليومية',
              icon: 'fa fa-search-dollar',
            },
            {
              displayName: 'الحسابات الختامية',
              menuItem: 'accounts-general-ledger',
              description: 'عرض وتحليل الحسابات الختامية',
              icon: 'fa fa-clipboard-check',
            },
            {
              displayName: 'الحسابات الختامية',
              menuItem: 'accounts-general-ledger',
              description: 'تحليل تفصيلي للحسابات الختامية',
              icon: 'fa fa-clipboard-check',
            },
             {
              displayName: 'مديونية الشركة',
              menuItem: 'indebtedness-report',
              description: 'تحليل تفصيلي لمديونية الشركة',
              icon: 'fa fa-clipboard-check',
              route: '/general-accounts/indebtedness-report'
            },
          ]
        }
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
        //   menuItem: 'Sales',
        //   description: 'إدارة عمليات البيع والفواتير الخاصة بالعملاء',
        //   icon: 'fa-solid fa-store',
        //   route: '/sales'
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
    }
    ,
    {
      menuItemId: MenuType.InventoryHome,
      displayName: 'المخازن',
      menuItem: 'Inventory',
      subMenus: [
        {
          menuItemId: MenuType.InventoryHome,
          displayName: 'المخازن',
          menuItem: '1',
          route: '/inventory/home/1',
          icon: 'fa fa-warehouse',
          subMenus: [
            {
              displayName: 'مجموعات الأصناف',
              menuItem: 'items-category',
              description: 'تعريف وتصنيف مجموعات الأصناف داخل المخازن',
              icon: 'fa fa-layer-group',
              route: '/inventory/items-category'
            },
            {
              displayName: 'الأصناف',
              menuItem: 'items',
              description: 'إدارة بيانات الأصناف المخزنية وتفاصيلها',
              icon: 'fa fa-boxes',
              route: '/inventory/items'
            },
            {
              displayName: 'قوالب الأصناف',
              menuItem: 'item-lookups',
              description: 'إدارة قوالب الأصناف المخزنية وتفاصيلها',
              icon: 'fa fa-boxes',
              route: '/inventory/item-lookups'
            },
            {
              displayName: 'طلب شراء',
              menuItem: 'material-requests',
              description: 'إنشاء وتتبع طلبات شراء المواد من المخازن',
              icon: 'fa fa-file-signature',
              route: '/inventory/material-requests'
            },
            {
              displayName: 'أوامر الشراء',
              menuItem: 'purchase-orders',
              description: 'إدارة أوامر الشراء الصادرة للموردين',
              icon: 'fa fa-clipboard-list',
              route: '/inventory/purchase-orders'
            },
            {
              displayName: 'إذن استلام',
              menuItem: 'material-receipt',
              description: 'تسجيل استلام المواد ودخولها إلى المخزن',
              icon: 'fa fa-truck-loading',
              route: '/inventory/material-receipt'
            },
            {
              displayName: 'إذن صرف مواد',
              menuItem: 'material-issue',
              description: 'تسجيل صرف المواد من المخازن إلى الجهات المختلفة',
              icon: 'fa fa-dolly-flatbed',
              route: '/inventory/material-issue'
            }
          ]
        },
        {
          menuItemId: MenuType.InventoryHome,
          displayName: 'البيانات الاساسية',
          menuItem: '2',
          route: '/inventory/home/2',
          icon: 'fa fa-cogs',
          subMenus: [
            {
              displayName: 'وحدات الأصناف',
              menuItem: 'units',
              description: 'description',
              icon: 'fa fa-balance-scale',
              route: '/inventory/units'
            }
          ]
        }
      ]
    }
    ,
    {
      menuItemId: MenuType.PurchasesHome,
      displayName: 'المشتريات',
      menuItem: 'Purchases',
      subMenus:
        [
          {
            menuItemId: MenuType.PurchasesHome,
            displayName: 'المشتريات',
            menuItem: '1',
            route: '/purchases/home/1',
            icon: 'fa fa-shopping-cart',
            subMenus: [
              {
                displayName: 'أوامر الشراء',
                menuItem: 'purchase-orders',
                description: 'إدارة أوامر الشراء وإنشاؤها',
                icon: 'fa fa-clipboard-list',
                route: '/purchases/purchase-orders'
              },
              {
                displayName: 'انشاء فاتورة شراء',
                menuItem: 'add-purchase-invoice',
                description: 'إدخال فاتورة شراء جديدة لمورد',
                icon: 'fa fa-file-invoice-dollar',
                route: '/purchases/add-purchase-invoice'
              },
              {
                displayName: 'فواتير الشراء',
                menuItem: 'purchase-invoices',
                description: 'عرض وإدارة فواتير الشراء للموردين',
                icon: 'fa fa-file-invoice',
                route: '/purchases/purchase-invoices'
              },
              {
                displayName: 'مرتجعات المشتريات',
                menuItem: 'purchase-returns',
                description: 'معالجة وإدارة المرتجعات على المشتريات',
                icon: 'fa fa-undo-alt',
                route: '/purchases/purchase-returns'
              },
              {
                displayName: 'كشف حساب مورد',
                menuItem: 'suppliers-account-statement',
                description: 'عرض جميع العمليات الخاصة بالموردين',
                icon: 'fa fa-file-alt',
                route: '/purchases/suppliers-account-statement'
              },
              {
                displayName: 'عروض الاسعار',
                menuItem: 'purchase-quotations',
                description: 'إدارة عروض الأسعار المستلمة من الموردين',
                icon: 'fa fa-tags',
                route: '/purchases/purchase-quotations'
              },
              {
                displayName: 'اشعارات خصم الموردين',
                menuItem: 'supplier-returns-voucher',
                description: 'إصدار إشعارات الخصم لمشتريات الموردين',
                icon: 'fa fa-receipt',
                route: '/purchases/supplier-returns-voucher'
              }
            ]
          },
          {
            menuItemId: MenuType.InventoryHome,
            displayName: 'البيانات الاساسية',
            menuItem: '2',
            route: '/purchases/home/2',
            icon: 'fa fa-database',
            subMenus: [
              {
                displayName: 'قائمة الموردين',
                menuItem: 'suppliers-list',
                description: 'إدارة بيانات الموردين وتفاصيل الاتصال',
                icon: 'fa fa-users',
                route: '/purchases/suppliers-list'
              }
            ]
          }
        ]


    },
    {
      menuItemId: MenuType.AdminHome,
      displayName: 'اعدادات النظام',
      menuItem: 'Admin Settings',
      subMenus: [
        {
          menuItemId: MenuType.AdminHome,
          displayName: 'الاعدادات',
          menuItem: '1',
          route: '/system-settings/home/1',
          icon: 'fa fa-warehouse',
          subMenus: [

            {
              displayName: 'لوحة التحكم',
              menuItem: 'dashboard',
              description: 'إنشاء وتتبع طلبات شراء المواد من المخازن',
              icon: 'fa fa-file-signature',
              route: '/system-settings/dashboard'
            },
            {
              displayName: 'بيانات الفروع',
              menuItem: 'branches',
              description: 'تعريف وتصنيف بيانات الفروع',
              icon: 'fa fa-layer-group',
              route: '/system-settings/branches'
            },
            {
              displayName: 'بيانات المستخدمين',
              menuItem: 'system-users',
              description: 'تعريف وتصنيف بيانات المستخدمين',
              icon: 'fa fa-layer-group',
              route: '/system-settings/system-users'
            },
            {
              displayName: 'صلاحيات المستخدمين',
              menuItem: 'roles',
              description: 'إدارة صلاحيات المستخدمين',
              icon: 'fa fa-cogs',
              route: '/system-settings/roles'
            }
          ]
        },
        // {
        //   menuItemId: MenuType.AdminHome,
        //   displayName: 'التقارير',
        //   menuItem: '2',
        //   route: '/inventory/home/2',
        //   icon: 'fa fa-cogs',
        //   subMenus: [
        //     {
        //       displayName: 'وحدات الأصناف',
        //       menuItem: 'units',
        //       description: 'description',
        //       icon: 'fa fa-balance-scale',
        //       route: '/inventory/units'
        //     }
        //   ]
        // }
      ]
    }
  ];
}
export enum MenuType {
  GeneralAccountsHome = 1,
  MainModules,
  InventoryHome,
  PurchasesHome,
  AdminHome

}
