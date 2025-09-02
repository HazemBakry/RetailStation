using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.DataImport
{
    public class ImporterColumnModel : CreatorModel
    {
        [Key]
        public int ImporterColumnId { get; set; }
        public int ImporterId { get; set; }

        public string ColumnName { get; set; }
        public string DataType { get; set; }
        public bool? IsRequired { get; set; }
        public int? DisplayOrder { get; set; }
        public virtual ImporterModel Importer { get; set; }
    }
}
