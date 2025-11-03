import { CreatorModel } from "src/app/components/Shared/models/CreatorModel";

export interface MerchantItemModel extends CreatorModel {
    merchantItemId?: number | null;
    itemId?: number | null;
    nameAR: string;
    nameEN: string;
    unitId: number | null;
    unitName: string;
    purchaseUnitId: number | null;
    purchaseUnitName: string;
    itemCategoryId: number | null;
    itemCategoryName: string;
    cost: number | null;
    price: number | null;
    price10: number | null;
    price100: number | null;
    price1000: number | null;
    quantity: number | null;
    purchasePrice: number | null;
    isActive: boolean | null;
    itemTypeId: number | null;
    merchantId: number | null;
    merchantName: string;
    description: string;
    disabled: boolean | null;
    isFavorite: boolean | null;
    isCompareAdded: boolean | null;
    isItemInCart: boolean | null;
    isBestSellerItem: boolean | null;
    image: File | null;
    imageUrl: string;
    deliveryCost: number | null;
    deliveryTime: number | null;
    rate: number | null;
    offerPrice: number | null;
    minimumOrderQuantity: number | null;
    paymentMethodId: number | null;
    merchantRate: number | null;
    paymentMethod: string;

}