using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.Common
{
    public interface ISQLHelper
    {
        List<TElement> SQLQuery<TElement>(string CommandText, string ConnectionString = null, params SqlParameter[] parameters);
        List<TElement> SQLQuery<TElement>(string CommandText, string ConnectionString = null, CommandType commandType = CommandType.StoredProcedure, params SqlParameter[] parameters);
        object ExecuteScalar(string CommandText, string ConnectionString = null, params SqlParameter[] Parameters);
        int ExecuteNonQuery(string CommandText, string ConnectionString = null, params SqlParameter[] Parameters);
        DataTable ExecuteDataTable(string CommandText, SqlParameter[] Parameters, string ConnectionString = null);
        DataSet ExecuteDataset(string CommandText, SqlParameter[] Parameters, string ConnectionString = null);
        Task<List<TElement>> SQLQueryAsync<TElement>(string CommandText, string connectionString = null, params SqlParameter[] Parameters);

        DataTable ExecuteDataTable(string CommandText, string ConnectionString, params SqlParameter[] Parameters);

    }
}
