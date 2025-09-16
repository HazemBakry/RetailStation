using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetailStation.Entities.DTOs.Website;
using RetailStation.Interface.Website;

namespace RetailStation.API.Controllers.Website
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CartController : ControllerBase
    {

        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet("GetCartItems")]
        public IActionResult GetCartItems(string userId)
        {
            var result = _cartService.GetCartItems(userId);
            return Ok(result);
        }

        [HttpPost]
        public IActionResult AddItemToCart([FromBody] CartModel model)
        {
            string userId = "";
            var result = _cartService.AddItemToCart(userId,model);
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpGet("RemoveItemFromCart")]
        public IActionResult RemoveItemFromCart(int cartId)
        {
            string userId = "";
            var result = _cartService.RemoveItemFromCart(userId,cartId);
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            return NotFound(result);
        }

        [HttpGet("ClearCart")]
        public IActionResult ClearCart()
        {
            string userId = "";
            var result = _cartService.ClearCart(userId);
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }
    }
}
