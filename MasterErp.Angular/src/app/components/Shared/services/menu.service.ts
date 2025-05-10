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
      subMenus:
        [
          {
            menuItemId: MenuType.GeneralAccountsHome,
            displayName: 'الادلة',
            menuItem: '1',
            subMenus:
              [
                {
                  displayName: 'شجرة الحسابات',
                  menuItem: 'AccountTree',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route:'/general-accounts/account-tree'
                },
                {
                  displayName: 'مراكز التكلفة',
                  menuItem: 'CostCenter',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route: '/general-accounts/cost-center-tree'
                },

              ]
          },
          {
            menuItemId: MenuType.GeneralAccountsHome,
            displayName: 'العمليات المالية',
            menuItem: '2',
            subMenus:
              [
                {
                  displayName: 'سجل القيود اليومية',
                  menuItem: 'journal-daily-list',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route:'/general-accounts/journal-daily-list'
                },
                {
                  displayName: 'انشاء قيد جديد',
                  menuItem: 'new-entry',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route: '/general-accounts/new-entry'
                },
                {
                  displayName: 'سندات الصرف',
                  menuItem: 'payment-receipts',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route: '/general-accounts/payment-receipts'
                },
                {
                  displayName: 'انشاء',
                  menuItem: 'new-entry',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route: '/general-accounts/new-entry'
                },
                {
                  displayName: 'سندات القبض',
                  menuItem: 'receive-receipts',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route: '/general-accounts/receive-receipts'
                },
                {
                  displayName: 'الرصيد الافتتاحي',
                  menuItem: 'opening-balance',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route: '/general-accounts/opening-balance'
                },
                {
                  displayName: 'القروض',
                  menuItem: 'loans',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route: '/general-accounts/loans'
                },
                {
                  displayName: 'طلبات السلف',
                  menuItem: 'loans-requests',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route: '/general-accounts/loans-requests'
                },

              ]
          },
          {
            menuItemId: MenuType.GeneralAccountsHome,
            displayName: 'تقارير مالية',
            menuItem: '3',
            subMenus:
              [
                {
                  displayName: 'الأستاذ العام',
                  menuItem: 'accounts-general-ledger',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route:'/general-accounts/accounts-general-ledger'
                },
                {
                  displayName: 'accounts-assistant-ledger',
                  menuItem: 'accounts-assistant-ledger',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route:'/general-accounts/accounts-assistant-ledger'
                },
                {
                  displayName: 'ميزان المراجعة',
                  menuItem: 'trial-balance',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route:'/general-accounts/trial-balance'
                },
                {
                  displayName: 'الأستاذ المساعد الشهرى',
                  menuItem: 'monthly-assistant-ledger',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route:'/general-accounts/monthly-assistant-ledger'
                },
                {
                  displayName: 'المركز المالى',
                  menuItem: 'balance-sheet',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route:'/general-accounts/balance-sheet'
                },

              ]
          },
          {
            menuItemId: MenuType.GeneralAccountsHome,
            displayName: 'الحسابات الختامية',
            menuItem: '4',
            subMenus:
              [
                {
                  displayName: 'الحسابات الختامية',
                  menuItem: 'accounts-general-ledger',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  // route:'/general-accounts/accounts-general-ledger'
                },
                {
                  displayName: 'الحسابات الختامية',
                  menuItem: 'accounts-general-ledger',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  // route:'/general-accounts/accounts-general-ledger'
                },
              ]
          },
          {
            menuItemId: MenuType.GeneralAccountsHome,
            displayName: 'تقارير مراكز التكلفة',
            menuItem: '5',
            subMenus:
              [
                {
                  displayName: 'الأستاذ العام - مراكز التكلفة',
                  menuItem: 'cost-general-ledger',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route:'/general-accounts/cost-general-ledger'
                },
                {
                  displayName: 'الأستاذ المساعد - مراكز التكلفة',
                  menuItem: 'cost-assistant-ledger',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route:'/general-accounts/cost-assistant-ledger'
                },
                {
                  displayName: 'ميزان مراجعة مراكز التكلفة',
                  menuItem: 'cost-trial-balance',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route:'/general-accounts/cost-trial-balance'
                },
                {
                  displayName: 'مصفوفة مراكز التكلفة',
                  menuItem: 'cost-center-matrix',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route:'/general-accounts/cost-center-matrix'
                },
              ]
          },
          {
            menuItemId: MenuType.GeneralAccountsHome,
            displayName: 'العملاء',
            menuItem: '6',
            subMenus:
              [
                {
                  displayName: 'العملاء',
                  menuItem: 'customers',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route:'/general-accounts/customers'
                },
                {
                  displayName: 'الدفعات',
                  menuItem: 'batches',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route:'/general-accounts/batches'
                },
              ]
          },
          {
            menuItemId: MenuType.GeneralAccountsHome,
            displayName: 'التهيئة والاعدادات',
            menuItem: '7',
            subMenus:
              [
                {
                  displayName: 'قوالب القيود',
                  menuItem: 'journal-entry-templates',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route:'/general-accounts/journal-entry-templates'
                },
                {
                  displayName: 'السنة المالية',
                  menuItem: 'financial-period',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route:'/general-accounts/financial-period'
                },
                {
                  displayName: 'دفاتر الايصال',
                  menuItem: 'receipt-ledgers',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route:'/general-accounts/receipt-ledgers'
                },
                {
                  displayName: 'شروط السداد',
                  menuItem: 'payment-terms',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route:'/general-accounts/payment-terms'
                },
                {
                  displayName: 'حساب الضريبة',
                  menuItem: 'tax-calculation',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route:'/general-accounts/tax-calculation'
                },
                {
                  displayName: 'الدفاتر اليومية',
                  menuItem: 'daily-notebook',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route:'/general-accounts/daily-notebook'
                },
                {
                  displayName: 'نماذج الأصول',
                  menuItem: 'receipt-ledgers',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route:'/general-accounts/receipt-ledgers'
                },
                {
                  displayName: 'أنواع الدفاتر اليومية',
                  menuItem: 'ledger-journal-types',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  route:'/general-accounts/ledger-journal-types'
                },
              ]
          },
          {
            menuItemId: MenuType.GeneralAccountsHome,
            displayName: 'اعدادات النظام',
            menuItem: '8',
            subMenus:
              [
                {
                  displayName: 'بيانات المستخدمين',
                  menuItem: 'journal-entry-templates',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  // route:'/general-accounts/journal-entry-templates'
                },
                {
                  displayName: 'مجموعات الأصناف',
                  menuItem: 'journal-entry-templates',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  // route:'/general-accounts/journal-entry-templates'
                },
                {
                  displayName: 'أذونات الإضافة',
                  menuItem: 'journal-entry-templates',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  // route:'/general-accounts/journal-entry-templates'
                },
              ]
          }
          ,
          {
            menuItemId: MenuType.GeneralAccountsHome,
            displayName: 'التقارير',
            menuItem: '9',
            subMenus:
              [
                {
                  displayName: 'الميزانية العمومية',
                  menuItem: 'journal-entry-templates',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  // route:'/general-accounts/journal-entry-templates'
                },
                {
                  displayName: 'كشف التدفقات النقدية',
                  menuItem: 'journal-entry-templates',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  // route:'/general-accounts/journal-entry-templates'
                },
                {
                  displayName: 'الإقرار الضريبي',
                  menuItem: 'journal-entry-templates',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  // route:'/general-accounts/journal-entry-templates'
                },
                {
                  displayName: ' دفتر الأستاذ العام للشركاء',
                  menuItem: 'journal-entry-templates',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  // route:'/general-accounts/journal-entry-templates'
                },
                {
                  displayName: 'تدقيق دفتر اليومية',
                  menuItem: 'journal-entry-templates',
                  description: 'description',
                  icon: 'uil uil-pound-circle',
                  // route:'/general-accounts/journal-entry-templates'
                },
                
              ]
          }
        ]
    }
  ];
}
export enum MenuType {
  GeneralAccountsHome = 1,

}
