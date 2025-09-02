import { OrderDetailModel } from "src/app/components/Shared/models/ItemModel";

export interface SupplierReturnsVoucherModel {
    supplierReturnsVoucherId: number | null;
    invoiceNumber: number | null;
    supplierId: number;
    // branchId: number;
    totalValue: number;
    invoiceDate: string | null;
    notes: string;
    userId: string;
    items: OrderDetailModel[];
}