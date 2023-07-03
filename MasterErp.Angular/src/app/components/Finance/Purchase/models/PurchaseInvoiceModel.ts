import { PurchaseInvoiceDetails } from "./PurchaseInvoiceDetailsModel";

export interface PurchaseInvoiceModel {
    purchaseInvoiceId: number | null;
    invoiceNumber: string;
    supplierId: number;
    branchId: number;
    totalValue: number;
    notes: string;
    userId: number | null;
    items: PurchaseInvoiceDetails[];
}