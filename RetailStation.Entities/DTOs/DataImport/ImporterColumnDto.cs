using MasterErp.Entities.Models;
using MasterErp.Entities.Models.DataImport;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.DataImport
{
    public class ImporterColumnDto: CreatorModel
    {
        public int? ImporterColumnId { get; set; }
        public int? ImporterId { get; set; }

        public string ColumnName { get; set; }
        public string DataType { get; set; }
        public bool? IsRequired { get; set; }
        public int? DisplayOrder { get; set; }

        public ImporterDto Importer { get; set; }
    }
}
