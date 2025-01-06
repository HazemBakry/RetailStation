using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.DataImport
{
    public class DBTableColumnsDto
    {
        public string SchemaName { get; set; }
        public string DBName { get; set; }
        public string TableName { get; set; }
        public string ColumnName { get; set; }
        public string DataType { get; set; }
        public bool? IsNullable { get; set; }

    }
    public class DBTableDto
    {
        public string SchemaName { get; set; }
        public string DBName { get; set; }
        public string TableName { get; set; }
        public List<DBColumnDto> Columns { get; set; }

    }
    public class DBStoredProcedureDto
    {
        public string SchemaName { get; set; }
        public string DBName { get; set; }
        public string StoredProcedureName { get; set; }

    }
    public class DBColumnDto
    {
        public string ColumnName { get; set; }
        public string DataType { get; set; }
        public bool? IsNullable { get; set; }
    }
}
