
export interface SalesInvoiceModel {
    salesInvoiceId?: number | null;
    invoiceNumber?: string;
    branchId?: number;
    notes?: string;
    userId?: number | null;
    items?: SalesInvoiceDetails[];
}


export interface SalesInvoiceDetails {
    salesInvoiceDetailsID?: number;
    salesInvoiceID?: number;
    itemID?: number;
    quantity?: number;
    price?: number;
    itemName?: string;
    unitID?: number;
    unitName?: string;
    subTotal?: number | null;
    discount?: number | null;
    totalValue?: number;
    notes?: string;
}