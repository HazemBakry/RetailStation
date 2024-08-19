using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Inventory.ReceiveOrder;
using MasterErp.Entities.DTOs.Shared;
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
        [Route("GetItemCategories")]
        public List<ItemCategory> GetItemCategories()
        {
            return ItemService.GetItemCategories();
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
        [Route("GetItemsListByCategoryId")]
        public DataTable GetItemsListByCategoryId(int ItemCategoryId, string SearchText)
        {
            var results = ItemService.GetItemsListByCategoryId(ItemCategoryId, SearchText);
            return results;
        }

        [HttpGet]
        [Route("GetItemsDeleted")]
        public DataTable GetItemsDeleted(int ItemCategoryId, string SearchText)
        {
            var results = ItemService.GetItemsDeleted(ItemCategoryId, SearchText);
            return results;
        }

        [HttpGet]
        [Route("GetItemsByCategoryId")]
        public List<Item> GetItemsByCategoryId(int CategoryId)
        {
            var results = ItemService.GetItemsByCategoryId(CategoryId);
            return results;
        }

        [HttpGet]
        [Route("GetItemDetailsByItemId")]
        public ItemSaveDTO GetItemDetailsByItemId(int ItemId)
        {
            var results = ItemService.GetItemDetailsByItemId(ItemId);
            return results;
        }

        [HttpPost]
        [Route("AddNewItem")]
        public bool AddNewItem(ItemSaveDTO model)
        {
            var results = ItemService.AddNewItem(model);
            return results;
        }

        [HttpPost]
        [Route("EditItem")]
        public bool EditItem(ItemSaveDTO model)
        {
            var results = ItemService.EditItem(model);
            return results;
        }

        [HttpGet]
        [Route("DeleteItem")]
        public (int StatusCode, string Message) DeleteItem(int ItemId)
        {
            return ItemService.DeleteItem(ItemId);
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
            var Url = ItemService.ExportAllItems(categoryId, SearchText, UserName);
            return Ok(new { Url = Url });
        }

        [HttpGet]
        [Route("ExportRawItemsDeleted")]
        public IActionResult ExportRawItemsDeleted(int categoryId, string SearchText, string UserName)
        {
            var Url = ItemService.ExportItemsDeleted(categoryId, SearchText, UserName);
            return Ok(new { Url = Url });
        }

    }
}
