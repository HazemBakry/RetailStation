using Microsoft.Extensions.Configuration;
using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Website;
using RetailStation.Entities.Models;
using RetailStation.Entities.Models.Purchases;
using RetailStation.Interface.Common;
using RetailStation.Interface.Website;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Service.Website
{
    public class CartService : ICartService
    {
        private readonly DBContext Context;
        private readonly LookupsDbContext LookupsDbContext;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly ISharedFilterService SharedFilterService;
        private readonly string ConnectionString;
        private readonly IExportService ExportService;
        private readonly IFileService _fileService;
        public readonly string ItemsImagesFolder;
        public CartService(DBContext Context, ISQLHelper SQLHelper,
            IConfiguration Configuration, IExportService ExportService,
            ISharedFilterService sharedFilterService, LookupsDbContext lookupsDbContext, IFileService fileService)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.Configuration = Configuration;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
            this.ExportService = ExportService;
            SharedFilterService = sharedFilterService;
            LookupsDbContext = lookupsDbContext;
            _fileService = fileService;
            ItemsImagesFolder = "ItemsImages";

        }




        public List<Cart> GetCartItems(string userId)
        {
            return Context.Carts.Where(c => c.UserId == userId).ToList();
        }

        public ActionsResponseModel AddItemToCart(string userId, CartModel model)
        {
            try
            {
                // Check if the item already exists in the cart for this user
                var existingCartItem = Context.Carts.FirstOrDefault(c =>
                    c.MerchantItemId == model.MerchantItemId && c.UserId == model.UserId);

                if (existingCartItem != null)
                {
                    // If item exists, update the quantity
                    existingCartItem.Quantity += model.Quantity;
                    Context.SaveChanges();
                }
                else
                {
                    // If item doesn't exist, add a new one
                    var newCartItem = new Cart
                    {
                        MerchantItemId = model.MerchantItemId,
                        Quantity = model.Quantity,
                        UserId = model.UserId
                    };
                    Context.Carts.Add(newCartItem);
                    Context.SaveChanges();
                }

                return new ActionsResponseModel
                {
                    IsSuccess = true,
                    Message = "Item added to cart successfully."
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = "An error occurred while adding the item to the cart."
                };
            }
        }

        public ActionsResponseModel RemoveItemFromCart(string userId,int cartId)
        {
            try
            {
                var cartItem = Context.Carts.FirstOrDefault(c => c.CartId == cartId);
                if (cartItem != null)
                {
                    Context.Carts.Remove(cartItem);
                    Context.SaveChanges();
                    return new ActionsResponseModel
                    {
                        IsSuccess = true,
                        Message = "Item removed from cart successfully."
                    };
                }
                else
                {
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "Item not found in cart."
                    };
                }
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = "An error occurred while removing the item."
                };
            }
        }

        public ActionsResponseModel ClearCart(string userId)
        {
            try
            {
                var userCartItems = Context.Carts.Where(c => c.UserId == userId).ToList();
                if (userCartItems.Any())
                {
                    Context.Carts.RemoveRange(userCartItems);
                    Context.SaveChanges();
                }

                return new ActionsResponseModel
                {
                    IsSuccess = true,
                    Message = "Cart cleared successfully."
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = "An error occurred while clearing the cart."
                };
            }
        }
    }
}
