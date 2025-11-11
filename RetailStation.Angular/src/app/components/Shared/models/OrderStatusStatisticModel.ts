export interface OrderStatusStatisticModel {
    pending: number | null;
    cancelled: number | null;
    rejected: number | null;
    approved: number | null;
    completed: number | null;
    totalCount: number | null;
}