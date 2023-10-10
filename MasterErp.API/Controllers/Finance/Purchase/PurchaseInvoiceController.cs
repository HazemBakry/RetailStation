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
        #region PurchasesInvoices

        [HttpGet]
        [Route("GetPurchaseInvoiceData")]
        public List<PurchaseInvoice> GetPurchaseInvoiceData()
        {
            return _purchaseInvoiceService.GetPurchaseInvoiceData();
        }


        [HttpPost]
        [Route("SaveNewPurchaseInvoice")]
        public (bool HasError, string InvoiceNumber) SaveNewPurchaseInvoice(PurchaseInvoiceModel model)
        {
            return _purchaseInvoiceService.SaveNewPurchaseInvoice(model);
        }


        [HttpGet]
        [Route("CancelPurchaseInvoice")]
        public IActionResult CancelPurchaseInvoice(int InvoiceId)
        {

            var result = _purchaseInvoiceService.CancelPurchaseInvoice(InvoiceId);
            return Ok(result);
        }



        [HttpGet]
        [Route("GetInvoicesSearchData")]
        public IActionResult GetInvoicesSearchData(int SupplierId,string InvoiceNumber,string InvoiceDate)
        {

            var result = _purchaseInvoiceService.GetInvoicesSearchData(SupplierId,InvoiceNumber,InvoiceDate);
            return Ok(result);
        }
        #endregion





        #region PurchasesOrders


        [HttpGet]
        [Route("GetPurchasesOrdersData")]
        public List<PurchaseOrder> GetPurchasesOrdersData()
        {
            return _purchaseInvoiceService.GetPurchasesOrdersData();
        }

        [HttpPost]
        [Route("SaveNewPurchaseOrder")]
        public IActionResult SaveNewPurchaseOrder(PurchaseOrderModel model)
        {
            var result = _purchaseInvoiceService.SaveNewPurchaseOrder(model);
            return Ok(result);
        }

        [HttpGet]
        [Route("CancelPurchaseOrder")]
        public IActionResult CancelPurchaseOrder(int OrderId)
        {

            var result = _purchaseInvoiceService.CancelPurchaseOrder(OrderId);
            return Ok(result);
        }

        #endregion


        #region PurchasesReturns


        [HttpGet]
        [Route("GetPurchasesReturnsData")]
        public List<PurchaseReturns> GetPurchasesReturnsData()
        {
            return _purchaseInvoiceService.GetPurchasesReturnsData();
        }


        [HttpPost]
        [Route("SaveNewPurchaseReturns")]
        public IActionResult SaveNewPurchaseReturns(PurchaseReturnsModel model)
        {
            var result = _purchaseInvoiceService.SaveNewPurchaseReturns(model);
            return Ok(result);
        }


        [HttpGet]
        [Route("CancelPurchaseInvoice")]
        public IActionResult CancelPurchaseReturns(int ReturnsId)
        {

            var result = _purchaseInvoiceService.CancelPurchaseReturns(ReturnsId);
            return Ok(result);
        }



        #endregion



        #region SuppliersStatement

        [HttpGet]
        [Route("GetSupplierStatementData")]
        public List<SupplierStatementModel> GetSupplierStatementData(int SupplierId)
        {
            return _purchaseInvoiceService.GetSupplierStatementData(SupplierId);
        }

        #endregion


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



    }
}
