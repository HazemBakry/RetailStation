export interface PurchaseReturnsModel{
    invoiceId:number;
    invoiceNumber: string;
    invoiceTypeId: string;
    orderDate: string;
    supplierId: number;
    branchId: number;
    totalValue: number;
    notes: string | null;
    userId: string | null;
    items: PurchaseReturnsDetails[];

}

export interface PurchaseReturnsDetails {
    purchaseReturnsDetailsID: number;
    purchaseReturnsID: number;
    itemID: number;
    quantity: number;
    price: number;
    totalValue: number;
    unitID: number;
    notes: string | null;
}

// export interface PurchaseReturns {
//     purchaseReturnsID: number;
//     supplierVoucherReturnsID: number;
//     invoiceTypeID: number;
//     invoiceNumber: string;
//     invoiceDate: string;
//     returnsDate: string | null;
//     supplierID: number;
//     purchaseInvoiceTotal: number;
//     returnsInvoiceTotal: number;
//     notes: string | null;
//     insertUser: string | null;
//     insertDate: string | null;
//     updateUser: string | null;
//     updateDate: string | null;
// }