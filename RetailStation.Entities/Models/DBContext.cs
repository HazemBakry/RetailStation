using RetailStation.Entities.Models.Subscription;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using RetailStation.Entities.Models.Global;
using RetailStation.Entities.Models.DataImport;
using RetailStation.Entities.Models.Inventory;
using RetailStation.Entities.Models.Purchases;
using RetailStation.Entities.Models.Operation;
using System.Collections.Generic;
using RetailStation.Entities.Models.SystemAdmin;
using RetailStation.Entities.DTOs.SystemSettings;

namespace RetailStation.Entities.Models
{
    public class DBContext : DbContext
    {
        private readonly IConfiguration Configuration;

        public DBContext(IConfiguration _configuration)
        {
            Configuration = _configuration;
        }

        public DBContext(DbContextOptions<DbContext> options)
           : base(options)
        {

        }

        //Elassal


        public DbSet<Customer> Customers { get; set; }
        public DbSet<Branch> Branches { get; set; }

        public DbSet<Page> Pages { get; set; }
        public DbSet<RoleAction> RoleActions { get; set; }
        public DbSet<PageAction> PageActions { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<ApplicationModel> Applications { get; set; }
        public DbSet<SubscriberApplicationModel> SubscriberApplications { get; set; }
        public DbSet<SubscriberModel> Subscribers { get; set; }
        public DbSet<MerchantRequest> MerchantRequests { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<MerchantOrder> MerchantOrders { get; set; }
        public DbSet<MerchantOrderDetail> MerchantOrderDetails { get; set; }
        public DbSet<Cart> Carts { get; set; }
        

        #region Depricated

        #region Global

        public DbSet<OrderStatus> OrderStatus { get; set; }


        #endregion

        public DbSet<Currency> Currency { get; set; }
        public DbSet<ItemLookups> ItemLookups { get; set; }
        public DbSet<ItemLookupDetails> ItemLookupDetails { get; set; }

        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Merchant> Merchants { get; set; }
        public DbSet<SupplierGroup> SupplierGroups { get; set; }
        public DbSet<Unit> Units { get; set; }
        public DbSet<Store> Stores { get; set; }


        #region Inventory

        public DbSet<ItemSupplier> ItemSuppliers { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<MerchantItem> SupplierItems { get; set; }
        public DbSet<MerchantItem> MerchantItems { get; set; }
        public DbSet<Slider> Sliders { get; set; }
        public DbSet<TotalValuePromotion> TotalValuePromotions { get; set; }
        public DbSet<Promotion> Promotions { get; set; }
        public DbSet<TopPartner> TopPartners { get; set; }
        public DbSet<UserFavoriteItem> UserFavoriteItems { get; set; }
        public DbSet<BestSellerItem> BestSellerItems { get; set; }
        public DbSet<ItemCategory> ItemCategories { get; set; }

        #endregion

        #region DataImport
        public DbSet<ImporterModel> Importers { get; set; }
        public DbSet<ImporterColumnModel> ImporterColumns { get; set; }
        #endregion

        #region System Admin

        public DbSet<Notification> Notifications { get; set; }
        public DbSet<NotificationRecipient> NotificationRecipients { get; set; }


        public DbSet<City> Cities { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Region> Regions { get; set; }


        #endregion

        #endregion

        //public DbSet<Country> Countries { get; set; }
        //public DbSet<City> Cities { get; set; }
        //public DbSet<Region> Regions { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                string connString = this.Configuration.GetConnectionString("DBConnection");
                optionsBuilder.UseSqlServer(connString);
                optionsBuilder.EnableSensitiveDataLogging();
            }
        }
    }
}
