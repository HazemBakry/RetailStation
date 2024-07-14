using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Inventory.ReceiveOrder;
using MasterErp.Entities.Models;
using MasterErp.Interface.Inventory;
using MasterErp.Service.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MasterErp.API.Controllers.Inventory
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly IItemService ItemService;

        public ItemController(IItemService ItemService)
        {
            this.ItemService = ItemService;
        }

        [HttpGet]
        [Route("GetItemsLookups")]
        public List<ItemLookups> GetItemsLookups()
        {
            return ItemService.GetItemsLookups();
        }

        [HttpGet]
        [Route("GetItemsData")]
        public IActionResult GetItemsData()
        {
            var result = ItemService.GetItemsData();
            return Ok(result);
        }

        [HttpGet]
        [Route("GetItemsByLookupId")]
        public IActionResult GetItemsByLookupId(int LookupId)
        {
            var result = ItemService.GetItemsByLookupId(LookupId);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetItemsBySupplierId")]
        public IActionResult GetItemsBySupplierId(int SupplierId)
        {
            var result = ItemService.GetItemsBySupplierId(SupplierId);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetItemsList")]
        public DataTable GetItemsList(int RawCategoryId, string SearchText)
        {
            var results = ItemService.GetItemsList(RawCategoryId, SearchText);
            return results;
        }

        [HttpGet]
        [Route("GetRawItemsDeleted")]
        public DataTable GetRawItemsDeleted(int RawCategoryId, string SearchText)
        {
            var results = ItemService.GetRawItemsDeleted(RawCategoryId, SearchText);
            return results;
        }

        [HttpGet]
        [Route("GetRawItemCategories")]
        public List<RawItemCategory> GetAllRawItemCategories()
        {
            var results = ItemService.GetAllRawItemCategories();
            return results;
        }

        [HttpGet]
        [Route("GetRawItemsByCategoryId")]
        public List<RawItem> GetRawItemsByCategoryId(int CategoryId)
        {
            var results = ItemService.GetRawItemsByCategoryId(CategoryId);
            return results;
        }

        [HttpGet]
        [Route("GetRawItemDetailsByRawItemId")]
        public RawItemModel GetRawItemDetailsByRawItemId(int RawItemId)
        {
            var results = ItemService.GetRawItemDetailsByRawItemId(RawItemId);
            return results;
        }

        [HttpPost]
        [Route("AddNewRawItem")]
        public bool AddNewRawItem(RawItemModel model)
        {
            var results = ItemService.AddNewRawItem(model);
            return results;
        }

        [HttpPost]
        [Route("EditRawItem")]
        public bool EditRawItem(RawItemModel model)
        {
            var results = ItemService.EditRawItem(model);
            return results;
        }

        [HttpGet]
        [Route("DeleteRawItem")]
        public (int StatusCode, string Message) DeleteRawItem(int RawItemId)
        {
            return ItemService.DeleteRawItem(RawItemId);
        }

        [HttpGet]
        [Route("GetRawItemsBySupplierId")]
        public DataTable GetRawItemsBySupplierId(int SupplierId)
        {
            return ItemService.GetRawItemsBySupplierId(SupplierId);
        }

        [HttpGet]
        [Route("GetUnits")]
        public List<Unit> GetUnits()
        {
            return ItemService.GetUnits();
        }

        [HttpPost]
        [Route("AddUnit")]
        public ActionsResponseModel AddUnit(Unit model)
        {
            return ItemService.AddUnit(model);
        }

        [HttpPost]
        [Route("EditUnit")]
        public ActionsResponseModel EditUnit(Unit model)
        {
            return ItemService.EditUnit(model);
        }

        [HttpGet]
        [Route("DeleteUnit")]
        public ActionsResponseModel DeleteUnit(int UnitId)
        {
            return ItemService.DeleteUnit(UnitId);
        }

        [HttpGet]
        [Route("ChangeItemStatus")]
        public ActionsResponseModel ChangeItemStatus(int RawItemId)
        {
            return ItemService.ChangeItemStatus(RawItemId);
        }

        [HttpGet]
        [Route("ExportAllRawItems")]
        public IActionResult ExportAllRawItems(int categoryId, string SearchText, string UserName)
        {
            var Url = ItemService.ExportAllRawItems(categoryId, SearchText, UserName);
            return Ok(new { Url = Url });
        }

        [HttpGet]
        [Route("ExportRawItemsDeleted")]
        public IActionResult ExportRawItemsDeleted(int categoryId, string SearchText, string UserName)
        {
            var Url = ItemService.ExportRawItemsDeleted(categoryId, SearchText, UserName);
            return Ok(new { Url = Url });
        }

    }
}
