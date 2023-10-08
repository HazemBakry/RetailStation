using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Models;
using MasterErp.Interface.Finance.Purchase;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MasterErp.API.Controllers.Finance.Purchase
{
    [Route("api/[controller]")]
    [ApiController]
    public class PurchaseInvoiceController : ControllerBase
    {
        private readonly IPurchaseInvoiceService _purchaseInvoiceService;

        public PurchaseInvoiceController(IPurchaseInvoiceService purchaseInvoiceService)
        {
            _purchaseInvoiceService = purchaseInvoiceService;
        }

        [HttpGet]
        [Route("GetPurchaseInvoiceData")]
        public List<PurchaseInvoice> GetPurchaseInvoiceData()
        {
            return _purchaseInvoiceService.GetPurchaseInvoiceData();
        }

        [HttpGet]
        [Route("CancelPurchaseInvoice")]
        public IActionResult CancelPurchaseInvoice(int InvoiceId)
        {
            
            var result =_purchaseInvoiceService.CancelPurchaseInvoice(InvoiceId);
            return Ok(result);
        }
        [HttpGet]
        [Route("GetSuppliersData")]
        public List<Supplier> GetSuppliersData()
        {
            return _purchaseInvoiceService.GetSuppliersData();
        }

        [HttpGet]
        [Route("GetBranchesData")]
        public List<Branch> GetBranchesData()
        {
            return _purchaseInvoiceService.GetBranchesData();
        }

        [HttpGet]
        [Route("GetItemLookupsData")]
        public List<ItemLookups> GetItemLookupsData()
        {
            return _purchaseInvoiceService.GetItemLookupsData();
        }

        [HttpGet]
        [Route("GetItemsData")]
        public DataTable GetItemsData()
        {
            return _purchaseInvoiceService.GetItemsData();
        }

        [HttpGet]
        [Route("GetItemsByLookupId")]
        public DataTable GetItemsByLookupId(int LookupId)
        {
            return _purchaseInvoiceService.GetItemsByLookupId(LookupId);
        }

        [HttpGet]
        [Route("GetItemsBySupplierId")]
        public DataTable GetItemsBySupplierId(int SupplierId)
        {
            return _purchaseInvoiceService.GetItemsBySupplierId(SupplierId);
        }

        [HttpPost]
        [Route("SaveNewPurchaseInvoice")]
        public (bool HasError, string InvoiceNumber) SaveNewPurchaseInvoice(PurchaseInvoiceModel model)
        {
            return _purchaseInvoiceService.SaveNewPurchaseInvoice(model);
        }


        [HttpPost]
        [Route("SaveNewPurchaseOrder")]
        public IActionResult SaveNewPurchaseOrder(PurchaseOrderModel model)
        {
            var result = _purchaseInvoiceService.SaveNewPurchaseOrder(model);
            return Ok(result);
        }


        [HttpPost]
        [Route("SaveNewPurchaseReturns")]
        public IActionResult SaveNewPurchaseReturns(PurchaseInvoiceModel model)
        {
            var result = _purchaseInvoiceService.SaveNewPurchaseReturns(model);
            return Ok(result);
        }








        [HttpGet]
        [Route("GetPurchasesOrdersData")]
        public List<PurchaseOrder> GetPurchasesOrdersData()
        {
            return _purchaseInvoiceService.GetPurchasesOrdersData();
        }

        [HttpGet]
        [Route("CancelPurchaseOrder")]
        public IActionResult CancelPurchaseOrder(int OrderId)
        {

            var result = _purchaseInvoiceService.CancelPurchaseOrder(OrderId);
            return Ok(result);
        }





        [HttpGet]
        [Route("GetPurchasesReturnsData")]
        public List<PurchaseInvoice> GetPurchasesReturnsData()
        {
            return _purchaseInvoiceService.GetPurchasesReturnsData();
        }

        [HttpGet]
        [Route("CancelPurchaseInvoice")]
        public IActionResult CancelPurchaseReturns(int ReturnsId)
        {

            var result = _purchaseInvoiceService.CancelPurchaseReturns(ReturnsId);
            return Ok(result);
        }





    }
}
