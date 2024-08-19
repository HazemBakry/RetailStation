using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Inventory.ReceiveOrder;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.DTOs.Inventory;
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
    public class ItemsController : ControllerBase
    {
        private readonly IItemsService _itemService;

        public ItemsController(IItemsService itemService)
        {
            _itemService = itemService;
        }


        #region Items

        [HttpPost]
        [Route("GetItems")]
        public IActionResult GetItems(int CategoryId, SearchFilterModel SearchModel)
        {
            var data = _itemService.GetItems(CategoryId, SearchModel);
            var result = new PagedResponseModel<ItemDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage

            };
            return Ok(result);
        }
        [HttpGet]
        [Route("GetItemById")]
        public ItemDto GetItemById(int ItemId)
        {
            var results = _itemService.GetItemById(ItemId);
            return results;
        }

        [HttpPost]
        [Route("AddNewItem")]
        public IActionResult AddNewItem(ItemDto model)
        {
            var results = _itemService.AddNewItem(model);
            return Ok(results);
        }

        [HttpPost]
        [Route("EditItem")]
        public IActionResult EditItem(int ItemId,ItemDto model)
        {
            var results = _itemService.EditItem(ItemId,model);
            return Ok(results);
        }

        [HttpGet]
        [Route("DeleteItem")]
        public IActionResult DeleteItem(int ItemId)
        {
            var results = _itemService.DeleteItem(ItemId);
            return Ok(results);
        }

        [HttpPost]
        [Route("ExportItems")]
        public IActionResult ExportItems(int categoryId, SearchFilterModel SearchModel)
        {
            string UserName = string.Empty;
            var Url = _itemService.ExportItems(categoryId, UserName, SearchModel);
            return Ok(new { Url = Url });
        }

        [HttpGet]
        [Route("GetItemSuppliersByItemId")]
        public IActionResult GetItemSuppliersByItemId(int ItemId)
        {
            var result = _itemService.GetItemSuppliersByItemId(ItemId);
            return Ok(result);
        }
        
        [HttpGet]
        [Route("GetItemsBySupplierId")]
        public IActionResult GetItemsBySupplierId(int SupplierId)
        {
            var result = _itemService.GetItemsBySupplierId(SupplierId);
            return Ok(result);
        }
        [HttpGet]
        [Route("GetItemsBySupplierIdV2")]
        public IActionResult GetItemsBySupplierIdV2(int SupplierId)
        {
            var result = _itemService.GetItemsBySupplierIdV2(SupplierId);
            return Ok(result);
        }


        #endregion



        [HttpGet]
        [Route("GetItemsLookups")]
        public List<ItemLookups> GetItemsLookups()
        {
            return _itemService.GetItemsLookups();
        }

        [HttpGet]
        [Route("GetItemCategories")]
        public List<ItemCategory> GetItemCategories()
        {
            return _itemService.GetItemCategories();
        }


        [HttpGet]
        [Route("GetItemsByLookupId")]
        public IActionResult GetItemsByLookupId(int LookupId)
        {
            var result = _itemService.GetItemsByLookupId(LookupId);
            return Ok(result);
        }





        [HttpGet]
        [Route("GetItemsDeleted")]
        public DataTable GetItemsDeleted(int ItemCategoryId, string SearchText)
        {
            var results = _itemService.GetItemsDeleted(ItemCategoryId, SearchText);
            return results;
        }

        [HttpGet]
        [Route("GetItemsByCategoryId")]
        public List<Item> GetItemsByCategoryId(int CategoryId)
        {
            var results = _itemService.GetItemsByCategoryId(CategoryId);
            return results;
        }



        [HttpGet]
        [Route("GetUnits")]
        public List<Unit> GetUnits()
        {
            return _itemService.GetUnits();
        }

        [HttpPost]
        [Route("AddUnit")]
        public ActionsResponseModel AddUnit(Unit model)
        {
            return _itemService.AddUnit(model);
        }

        [HttpPost]
        [Route("EditUnit")]
        public ActionsResponseModel EditUnit(Unit model)
        {
            return _itemService.EditUnit(model);
        }

        [HttpGet]
        [Route("DeleteUnit")]
        public ActionsResponseModel DeleteUnit(int UnitId)
        {
            return _itemService.DeleteUnit(UnitId);
        }

        [HttpGet]
        [Route("ChangeItemStatus")]
        public ActionsResponseModel ChangeItemStatus(int ItemId)
        {
            return _itemService.ChangeItemStatus(ItemId);
        }



        [HttpGet]
        [Route("ExportItemsDeleted")]
        public IActionResult ExportItemsDeleted(int categoryId, string SearchText, string UserName)
        {
            var Url = _itemService.ExportItemsDeleted(categoryId, SearchText, UserName);
            return Ok(new { Url = Url });
        }

    }
}
