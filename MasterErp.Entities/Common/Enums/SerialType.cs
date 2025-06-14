using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common.Enums
{
    public enum SerialType
    {
        [Description("PO")]
        PurchaseOrder,
        [Description("PR")]
        PurchaseReturn,
        [Description("PQ")]
        PurchaseQuotation,

        [Description("MR")]
        MaterialRequest,
        [Description("RC")]
        MaterialReceipt,

        [Description("INV")]
        Invoice,
        [Description("PI")]
        PurchaseInvoice,
        [Description("SO")]
        SalesOrder
    }

}
