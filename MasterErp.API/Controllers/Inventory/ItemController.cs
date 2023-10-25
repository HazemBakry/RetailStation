using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Inventory.ReceiveOrder;
using MasterErp.Entities.Models;
using MasterErp.Interface.Inventory;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

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

    }
}
