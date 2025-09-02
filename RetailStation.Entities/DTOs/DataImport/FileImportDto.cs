using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.DataImport
{
    public class FileImportDto
    {
        public int? ImporterId { get; set; }
        public IFormFile ImportFile { get; set; }
    }
}
