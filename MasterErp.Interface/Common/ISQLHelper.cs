using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Common
{
    public interface ISQLHelper
    {
        List<TElement> SQLQuery<TElement>(string CommandText, string ConnectionString, params SqlParameter[] parameters);
        List<TElement> SQLQuery<TElement>(string CommandText, string ConnectionString, CommandType commandType = CommandType.StoredProcedure, params SqlParameter[] parameters);
        object ExecuteScalar(string CommandText, string ConnectionString, params SqlParameter[] Parameters);
        int ExecuteNonQuery(string CommandText, string ConnectionString, params SqlParameter[] Parameters);
        DataTable ExecuteDataTable(string CommandText, string ConnectionString, params SqlParameter[] Parameters);
        DataSet ExecuteDataset(string CommandText, string ConnectionString, params SqlParameter[] Parameters);
        Task<List<TElement>> SQLQueryAsync<TElement>(string CommandText, string connectionString, params SqlParameter[] Parameters);
    }
}
