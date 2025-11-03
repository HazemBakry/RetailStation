using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Operation
{
    [Table("TopPartners", Schema = "Website")]

    public class TopPartner : CreatorModel
    {
        public int TopPartnerId { get; set; }

        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string Image { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; } = true;
        public int DisplayOrder { get; set; }
    }
}
