export enum FinanceWorkflowStatus {
    Pending = 7, //معلق
    Cancelled = 8, //ملغى
    WaitingPayment = 9, //بانتظار الدفع
    Paid = 10 //مدفوع
}

export enum HRWorkflowStatus {
    Pending = 11, //معلق
    Rejected = 12,//ملغى
    Approved = 13,//مقبول
    Completed = 14,//منتهي
}
export enum InventoryWorkflowStatus {
    Pending = 24, //معلق
    Rejected = 25,//ملغى
    Approved = 26,//مقبول
    Completed = 27,//منتهي
}

export enum PaymentWorkflowStatus {
    Paid = 15, //مدفوع
    UnPaid = 16 //مدفوع
}

export enum WorkflowStatusGroup {
    Finance = 'Finance',
    HR = 'HR',
    Payment = 'Payment',
    Job = 'Job',
    All = '',
}

export enum JobWorkflowStatus {
    Active = 17,
    Vacation = 18,
    Exit = 19,
    Escape = 20,
    Pending = 21,
    Case = 22,
    DontReturnVacation = 23
}


