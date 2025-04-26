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

        [Description("MR")]
        MaterialRequest,

        [Description("INV")]
        Invoice,

        [Description("SO")]
        SalesOrder
    }

}
