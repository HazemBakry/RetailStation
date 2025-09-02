using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.DataImport
{
    public class ImporterModel : CreatorModel
    {
        [Key]
        public int ImporterId { get; set; }
        public string ImporterName { get; set; }
        public string ImporterType { get; set; }
        public string TemplatePath { get; set; }
        public string DestinationStoredProcedure { get; set; }


        public virtual ICollection<ImporterColumnModel> Columns { get; set; }
    }
}
