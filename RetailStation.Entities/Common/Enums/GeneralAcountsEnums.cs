using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Common.Enums
{
    public enum SearchLevelType
    {
        GroupsAndAccounts = 1,
        GroupsOnly = 2,
        AccountsOnly = 3
    }

    public enum CostCenterType
    {
        Expenses = 1,       //مصروفات
        Withdrawals = 2     //مسحوبات

    }

    public enum PaymentOperationType
    {
        Cash = 1,    //شيكات
        Cheque = 2 //نقدي
    }

    public enum EntryType
    {
        Settlement = 1,    //تسوية
        Receiving = 2, //قبض
        Cashing = 3, //صرف
        Closing = 4, //اقفال
        OpeningConstraint = 5, //قيد افتتاحى
    }

    public enum JournalActionType
    {
        Manual = 1, //تسوية
        PurchaseInvoice = 2, //   فاتورة مشتريات  
        ChequePayment = 3, //  ايصال دفع شيك   
        CashPayment = 4,   //   ايصال دفع نقدى  
        CashBankDeposit = 5,
        CashReceive = 6,
        ChequeReceiveReceipt = 7

        //ايداع نقدي بالبنك   Cash Bank Deposit
        //ايصال استلام نقدي   Cash Receive
        //ايصال استلام شيك    Cheque Receive Receipt
        //ايصال ارتجاع دفع شيك    Cheque Payment Reverse Receipt
        //ايصال ارتجاع استلام شيك Cheque Receive Reverse Receipt
        //مخازن   Inventory
        //رواتب   Salaries
        //إهلاك أصول  Assets Depreciation
        //مردودات مشتريات Purchase Returns
        //اشعار تسوية رصيد    اشعار تسوية رصيد
        //إذن صرف إذن صرف
        //خصم مكتسب   خصم مكتسب
        //مبيعات الخبر    Sales khobar
        //مبيعات الدمام   Sales Dammam
        //رصيد افتتاحى    رصيد افتتاحى
        //ايصال تحويل بنكي    Bank Transfer Payment
    }

}
