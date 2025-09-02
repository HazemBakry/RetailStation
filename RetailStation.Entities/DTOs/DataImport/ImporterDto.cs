using RetailStation.Entities.Models.DataImport;
using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.DataImport
{
    public class ImporterDto : CreatorModel
    {
        public int? ImporterId { get; set; }
        public string ImporterName { get; set; }
        public string ImporterType { get; set; }
        public string TemplatePath { get; set; }
        public string DestinationStoredProcedure { get; set; }

        public int? TotalCount { get; set; }

        public List<ImporterColumnDto> Columns { get; set; }
    
    }
}
