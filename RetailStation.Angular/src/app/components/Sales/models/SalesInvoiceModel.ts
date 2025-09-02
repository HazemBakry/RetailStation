import { OrderDetailModel } from "src/app/components/Shared/models/ItemModel";
export interface SalesInvoiceModel {
    salesInvoiceId: number | null;
    invoiceNumber: number;
    supplierId: number | null;
    branchId: number | null;
    totalValue: number;
    taxPercent: number;
    subTotal: number;
    discount: number;
    discountPercent: number;
    netValue: number;
    invoiceDate: string;
    docNumber: string;
    notes: string;
    userId: string;
    customerId: string;
    items: OrderDetailModel[];
}