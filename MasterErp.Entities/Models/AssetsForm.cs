using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    [Table("AssetsForms", Schema = "Finance")]
    public class AssetsForm: CreatorModel
    {
        public int AssetsFormId { get; set; }
        public string AssetsFormName { get; set; }
        public string Method { get; set; }
        public int AccountTreeId { get; set; }
        public int CostTreeId { get; set; }
        public string DurationTxt { get; set; }
        public int DurationCount { get; set; }
        public string Calculation { get; set; }
    }
}
