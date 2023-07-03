export interface PurchaseInvoiceDetails {
    purchaseInvoiceDetailsID?: number;
    purchaseInvoiceID?: number;
    itemID?: number;
    quantity?: number;
    price?: number;
    totalValue?: number;
    discount?: number | null;
    unitID?: number;
    tax?: number | null;
    netValue?: number | null;
    productionDate?: string | null;
    itemName?: string;
    unitName?: string;
    expireDate?: string | null;
    notes?: string;
}