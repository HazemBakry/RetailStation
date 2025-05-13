export enum FinanceWorkflowStatus {
    Pending = 7, //معلق
    Cancelled = 8, //ملغى
    WaitingPayment = 9, //بانتظار الدفع
    Paid = 10 //مدفوع
}
 
export enum HRWorkflowStatus {
    Pending = 11, //معلق
    Rejected = 12 ,//ملغى
    Approved = 13 ,//مقبول
    Completed = 14 ,//منتهي
}
export enum PaymentWorkflowStatus {
    Paid = 15, //مدفوع
    UnPaid = 16 //مدفوع
}