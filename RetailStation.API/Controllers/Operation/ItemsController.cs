using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Inventory.ReceiveOrder;
using RetailStation.Entities.DTOs.HR;
using RetailStation.Service.Common;
using RetailStation.Service.Inventory;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using RetailStation.Interface.Operation;
using RetailStation.Entities.Models.Operation;
using RetailStation.Entities.DTOs.Operation;

namespace RetailStation.API.Controllers.Operation
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class ItemsController : ControllerBase
    {
        private readonly IItemsService _itemService;

        public ItemsController(IItemsService itemService)
        {
            _itemService = itemService;
        }


        #region Items

        [HttpPost]
        [Route("GetItemsData")]
        public IActionResult GetItemsData(SearchFilterModel SearchModel)
        {
            var data = _itemService.GetItemsData(SearchModel);
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
        [Route("GetItemDetailsById")]
        public IActionResult GetItemDetailsById(int ItemId)
        {
            var results = _itemService.GetItemDetailsById(ItemId);
            return Ok(results);
        }

        [HttpPost]
        [Route("AddNewItem")]
        public async Task<IActionResult> AddNewItem([FromForm] ItemDto model)
        {
            var results = await _itemService.AddNewItem(model);
            return Ok(results);
        }

        [HttpPost]
        [Route("EditItem")]
        public async Task<IActionResult> EditItem(int ItemId, [FromForm] ItemDto model)
        {
            var results = await _itemService.EditItem(ItemId, model);
            return Ok(results);
        }

        [HttpGet]
        [Route("DeleteItem")]
        public IActionResult DeleteItem(int ItemId)
        {
            var results = _itemService.DeleteItem(ItemId);
            return Ok(results);
        }
        [HttpGet]
        [Route("ChangeItemActiveStatus")]
        public ActionsResponseModel ChangeItemStatus(int ItemId)
        {
            return _itemService.ChangeItemActiveStatus(ItemId);
        }
        [HttpGet]
        [Route("ItemQuickUpdate")]
        public ActionsResponseModel ItemQuickUpdate(int ItemId, decimal Price, int UnitId)
        {
            return _itemService.ItemQuickUpdate(ItemId, Price, UnitId);
        }
        [HttpPost]
        [Route("ExportItems")]
        public IActionResult ExportItems(int categoryId, SearchFilterModel SearchModel)
        {
            string UserName = string.Empty;
            var results = _itemService.ExportItems(categoryId, UserName, SearchModel);
            return Ok(results);
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

        #region ItemCategories
        [HttpGet]
        [Route("GetItemCategories")]
        public IActionResult GetItemCategories()
        {

            var data = _itemService.GetItemCategories();
            var result = new PagedResponseModel<ItemCategoryModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = 0,
                CurrentPage = 0

            };
            return Ok(result);
        }

        [HttpGet]
        [Route("GetItemCategoryById")]
        public ItemCategoryModel GetItemCategoryById(int CategoryId)
        {
            var results = _itemService.GetItemCategoryDetails(CategoryId);
            return results;
        }

        [HttpPost]
        [Route("AddNewItemCategory")]
        public IActionResult AddNewItemCategory(ItemCategoryModel model)
        {
            var results = _itemService.AddNewItemCategory(model);
            return Ok(results);
        }

        [HttpPost]
        [Route("EditItemCategory")]
        public IActionResult EditItemCategory(int ItemCategoryId, ItemCategoryModel model)
        {
            var results = _itemService.EditItemCategory(ItemCategoryId, model);
            return Ok(results);
        }

        [HttpGet]
        [Route("DeleteItemCategory")]
        public IActionResult DeleteItemCategory(int ItemCategoryId)
        {
            var results = _itemService.DeleteItemCategory(ItemCategoryId);
            return Ok(results);
        }

        [HttpPost]
        [Route("ExportCategories")]
        public IActionResult ExportCategories(int categoryId, SearchFilterModel SearchModel)
        {
            string UserName = string.Empty;
            var results = _itemService.ExportCategories(categoryId, UserName, SearchModel);
            return Ok(results);
        }


        [HttpGet]
        [Route("ChangeItemCategoryActiveStatus")]
        public IActionResult ChangeItemCategoryActiveStatus(int CategoryId)
        {
            var results = _itemService.ChangeItemCategoryActiveStatus(CategoryId);
            return Ok(results);
        }


        [HttpPost]
        [Route("ChangeCategoriesDisplayOrder")]
        public IActionResult ChangeCategoriesDisplayOrder([FromBody] List<CategorySortModel> Categories)
        {
            var results = _itemService.ChangeCategoriesDisplayOrder(Categories);
            return Ok(results);
        }
        #endregion






        [HttpGet]
        [Route("GetItemsDeleted")]
        public List<ItemDto> GetItemsDeleted(int ItemCategoryId, string SearchText)
        {
            var results = _itemService.GetItemsDeleted(ItemCategoryId, SearchText);
            return results;
        }

        [HttpPost]
        [Route("GetItemsByCategoryId")]
        public List<ItemDto> GetItemsByCategoryId(int CategoryId, SearchFilterModel FilterModel)
        {
            FilterModel.FilterList.Add(new FilterItem
            {
                CategoryDisplayName = "CategoryId",
                CategoryName = "CategoryId",
                ItemValue = CategoryId.ToString(),
                ItemKey = CategoryId.ToString(),
                ItemFlag = CategoryId.ToString(),
            });

            var results = _itemService.GetItemsData(FilterModel);
            return results;
        }

        [HttpPost]
        [Route("GetUnits_Data")]
        public IActionResult GetUnits_Data(SearchFilterModel model)
        {
            var data = _itemService.GetUnits_Data(model);

            var result = new PagedResponseModel<UnitModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpPost]
        [Route("AddUnit")]
        public ActionsResponseModel AddUnit(UnitModel model)
        {
            return _itemService.AddUnit(model);
        }

        [HttpPost]
        [Route("EditUnit")]
        public ActionsResponseModel EditUnit(int UnitId, UnitModel model)
        {
            return _itemService.EditUnit(UnitId, model);
        }

        [HttpGet]
        [Route("DeleteUnit")]
        public ActionsResponseModel DeleteUnit(int UnitId)
        {
            return _itemService.DeleteUnit(UnitId);
        }





        [HttpGet]
        [Route("ExportItemsDeleted")]
        public IActionResult ExportItemsDeleted(int categoryId, string SearchText, string UserName)
        {
            var Url = _itemService.ExportItemsDeleted(categoryId, SearchText, UserName);
            return Ok(new { Url });
        }


        #region ItemLookups



        [HttpPost]
        [Route("GetItemLookups_Data")]
        public IActionResult GetItemLookups_Data(SearchFilterModel model)
        {
            var data = _itemService.GetItemLookups_Data(model);

            var result = new PagedResponseModel<ItemLookupModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }
        [HttpGet]
        [Route("GetItemLookupDetailsById")]
        public IActionResult GetItemLookupDetailsById(int ItemLookupId)
        {
            var results = _itemService.GetItemLookupDetailsById(ItemLookupId);
            return Ok(results);

        }
        [HttpPost]
        [Route("CreateNewItemLookup")]
        public IActionResult CreateNewItemLookup(ItemLookupModel model)
        {
            var results = _itemService.CreateNewItemLookup(model);
            return Ok(results);
        }
        [HttpPost]
        [Route("EditItemLookup")]
        public IActionResult EditItemLookup(int ItemLookupId, ItemLookupModel model)
        {
            var results = _itemService.EditItemLookup(ItemLookupId, model);
            return Ok(results);
        }
        [HttpGet]
        [Route("DeleteItemLookup")]
        public IActionResult DeleteItemLookup(int ItemLookupId)
        {
            var results = _itemService.DeleteItemLookup(ItemLookupId);
            return Ok(results);
        }
        [HttpPost]
        [Route("AddItemsToLookup")]
        public IActionResult AddItemsToLookup(int ItemLookupId, List<ItemLookupDetailsModel> model)
        {
            var results = _itemService.AddItemsToLookup(ItemLookupId, model);
            return Ok(results);
        }



        [HttpGet]
        [Route("GetItemsLookups")]
        public List<ItemLookups> GetItemsLookups()
        {
            return _itemService.GetItemsLookups();
        }




        [HttpGet]
        [Route("GetItemsByLookupId")]
        public IActionResult GetItemsByLookupId(int ItemLookupId)
        {
            var result = _itemService.GetItemsByLookupId(ItemLookupId);
            return Ok(result);
        }

        #endregion

    }
}
