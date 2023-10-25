import { OrderDetailModel } from "src/app/Models/ItemModel";
import { PurchaseInvoiceDetails } from "./PurchaseInvoiceDetailsModel";

export interface PurchaseInvoiceModel {
    purchaseInvoiceId: number | null;
    invoiceNumber: string;
    invoiceDate: Date;
    supplierId: number;
    InvoiceTypeId: number;
    branchId: number;
    totalValue: number;
    notes: string;
    userId: number | null;
    items: OrderDetailModel[];
}