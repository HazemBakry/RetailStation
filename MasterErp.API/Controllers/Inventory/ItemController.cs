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
        private readonly DBContext Context;

        public ItemController(IItemService ItemService, DBContext Context)
        {
            this.ItemService = ItemService;
            this.Context = Context;
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
            var results = (from supplier in Context.ItemSuppliers
                           join item in Context.RawItems on supplier.ItemId equals item.RawItemId
                           join unit in Context.Units on item.MainUnitId equals unit.UnitId
                           where supplier.SupplierId == SupplierId
                           select new
                           {
                               RawItemId = item.RawItemId,
                               NameEn = item.NameEn,
                               NameAr = item.NameAr,
                               Cost = item.Cost,
                               UnitNameAr = unit.UnitNameAr,
                               UnitNameEn = unit.UnitNameEn,
                               UnitId = unit.UnitId
                           }).ToList();

            DataTable dt = results.ToDataTable();
            return dt;
        }

        [HttpGet]
        [Route("GetUnits")]
        public async Task<List<Unit>> GetUnits()
        {
            var results = await Context.Units.ToListAsync();
            return results;
        }

        [HttpPost]
        [Route("AddUnit")]
        public bool AddUnit(Unit model)
        {
            try
            {
                Context.Add(new Unit
                {
                    UnitNameAr = model.UnitNameAr,
                    UnitNameEn = model.UnitNameEn
                });

                Context.SaveChanges();
                return true;
            }
            catch (Exception Ex)
            {
                return false;
            }
        }

        [HttpPost]
        [Route("EditUnit")]
        public bool EditUnit(Unit model)
        {
            var Item = Context.Units.Where(x => x.UnitId == model.UnitId).FirstOrDefault();

            if (Item != null)
            {
                Item.UnitNameAr = model.UnitNameAr;
                Item.UnitNameEn = model.UnitNameEn;

                Context.SaveChanges();
                return true;
            }
            else
                return false;
        }

        [HttpGet]
        [Route("DeleteUnit")]
        public bool DeleteUnit(int UnitId)
        {
            var item = Context.Units.FirstOrDefault(m => m.UnitId == UnitId);

            if (item == null)
            {
                return false;
            }
            else
            {
                Context.Remove(item);
                Context.SaveChanges();

                return true;
            }
        }

        [HttpGet]
        [Route("ChangeItemStatus")]
        public bool ChangeItemStatus(int RawItemId)
        {
            var item = Context.RawItems.Where(a => a.RawItemId == RawItemId).FirstOrDefault();

            if (item.IsActive)
            {
                item.IsActive = false;
            }
            else
            {
                item.IsActive = true;
            }
            Context.SaveChanges();
            return true;
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
