using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Website;
using RetailStation.Entities.Models.Website;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.Website
{
    public interface ICartService
    {
        List<Cart> GetCartItems(string userId);
        ActionsResponseModel AddItemToCart(string userId, CartModel model);
        ActionsResponseModel RemoveItemFromCart(string userId,int cartId);
        ActionsResponseModel ClearCart(string userId);
    }
}
