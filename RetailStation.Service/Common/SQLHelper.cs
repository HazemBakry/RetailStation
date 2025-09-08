using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Common;
using RetailStation.Service.Common;
using RetailStation.Interface.Common;
using RetailStation.Entities.Models;
using Microsoft.AspNetCore.Http;

namespace RetailStation.Service.Common
{

    public class SQLHelper : ISQLHelper
    {

        private readonly string CustomerConnectionString;
        int Timeout = 9999;

        public SQLHelper(IHttpContextAccessor httpContextAccessor, ITenantService tenantService)
        {
            var user = httpContextAccessor.HttpContext?.User;
            if (user == null)
            {
                throw new Exception("SubscriberId is required in the request header.");
            }
            var subscriberId = user.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            CustomerConnectionString = tenantService.GetConnectionString(subscriberId);
        }

        public List<TElement> SQLQuery<TElement>(string CommandText, string ConnectionString = null, params SqlParameter[] Parameters)
        {
            string ConnString = ConnectionString == null ? this.CustomerConnectionString : ConnectionString;
            using (SqlConnection sqlConn = new SqlConnection(ConnString))
            {
                using (SqlCommand cmd = new SqlCommand(CommandText, sqlConn))
                {
                    cmd.CommandText = CommandText;
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.CommandTimeout = (int)TimeSpan.FromMinutes(5).TotalSeconds;
                    foreach (var parameter in Parameters)
                    {
                        var paramter = cmd.CreateParameter();
                        paramter.ParameterName = parameter.ParameterName;
                        paramter.Value = parameter.Value;
                        if (!string.IsNullOrEmpty(parameter.TypeName))
                        {
                            paramter.SqlDbType = SqlDbType.Structured;
                            paramter.TypeName = parameter.TypeName;
                        }
                        cmd.Parameters.Add(paramter);
                    }

                    sqlConn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        var result = reader.MapToList<TElement>();
                        sqlConn.Close();
                        return result;
                    }
                }
            }
        }

        public List<TElement> SQLQuery<TElement>(string CommandText, string ConnectionString = null, CommandType commandType = CommandType.StoredProcedure, params SqlParameter[] Parameters)
        {
            //string ConnectionString = connectionStringName == null ? _ApplicationConfiguration.ConnectionString : _ApplicationConfiguration.GetConnectionString(connectionStringName);
            string ConnString = ConnectionString == null ? this.CustomerConnectionString : ConnectionString;
            using (SqlConnection sqlConn = new SqlConnection(ConnString))
            {
                using (SqlCommand cmd = new SqlCommand(CommandText, sqlConn))
                {
                    cmd.CommandText = CommandText;
                    cmd.CommandType = commandType;
                    cmd.CommandTimeout = (int)TimeSpan.FromMinutes(5).TotalSeconds;
                    foreach (var parameter in Parameters)
                    {
                        var paramter = cmd.CreateParameter();
                        paramter.ParameterName = parameter.ParameterName;
                        paramter.Value = parameter.Value;
                        if (!string.IsNullOrEmpty(parameter.TypeName))
                        {
                            paramter.SqlDbType = SqlDbType.Structured;
                            paramter.TypeName = parameter.TypeName;
                        }
                        cmd.Parameters.Add(paramter);
                    }

                    sqlConn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        var result = reader.MapToList<TElement>();
                        sqlConn.Close();
                        return result;
                    }
                }
            }
        }

        public object ExecuteScalar(string CommandText, string ConnectionString = null, params SqlParameter[] Parameters)
        {
            string ConnString = ConnectionString == null ? this.CustomerConnectionString : ConnectionString;

            using (SqlConnection sqlConn = new SqlConnection(ConnString))//_ApplicationConfiguration.ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand(ConnString, sqlConn))
                {
                    cmd.CommandText = ConnString;
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.CommandTimeout = (int)TimeSpan.FromMinutes(5).Milliseconds;

                    for (int i = 0; i < Parameters.Length; i++)
                    {
                        cmd.Parameters.Add(Parameters[i]);
                    }

                    sqlConn.Open();
                    object obj = cmd.ExecuteScalar();
                    cmd.Parameters.Clear();
                    sqlConn.Close();
                    return obj;
                }
            }
        }

        public int ExecuteNonQuery(string CommandText, string ConnectionString = null, params SqlParameter[] Parameters)
        {
            string ConnString = ConnectionString == null ? this.CustomerConnectionString : ConnectionString;

            using (SqlConnection connection = new SqlConnection(ConnString))
            {
                connection.Open();
                SqlCommand command = new SqlCommand();
                command.Connection = connection;
                command.CommandTimeout = Timeout;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = CommandText;
                for (int i = 0; i < Parameters.Length; i++)
                {
                    command.Parameters.Add(Parameters[i]);
                }
                int ret = -1;
                try
                {
                    ret = command.ExecuteNonQuery();
                }
                catch (Exception)
                {
                    return ret;
                }
                command.Parameters.Clear();
                return ret;
            }
        }

        public DataTable ExecuteDataTable(string commandText, SqlParameter[] Parameters, string ConnectionString = null)
        {
            string ConnString = ConnectionString == null ? this.CustomerConnectionString : ConnectionString;

            using (SqlConnection connection = new SqlConnection(ConnString))
            {
                DataTable dt = new DataTable();
                connection.Open();
                SqlCommand command = new SqlCommand();

                command.Connection = connection;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = commandText;
                for (int i = 0; i < Parameters.Length; i++)
                {
                    command.Parameters.Add(Parameters[i]);

                }
                SqlDataAdapter adpater = new SqlDataAdapter(command);
                adpater.SelectCommand.CommandTimeout = 1200;
                adpater.Fill(dt);
                connection.Close();
                return dt;
            }
        }
        public DataTable ExecuteDataTable(string commandText, string ConnectionString, params SqlParameter[] Parameters)
        {
            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                DataTable dt = new DataTable();
                connection.Open();
                SqlCommand command = new SqlCommand();

                command.Connection = connection;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = commandText;
                for (int i = 0; i < Parameters.Length; i++)
                {
                    command.Parameters.Add(Parameters[i]);

                }
                SqlDataAdapter adpater = new SqlDataAdapter(command);
                adpater.SelectCommand.CommandTimeout = 1200;
                adpater.Fill(dt);
                connection.Close();
                return dt;
            }
        }

        public DataSet ExecuteDataset(string commandText, SqlParameter[] Parameters, string ConnectionString = null)
        {
            try
            {
                string ConnString = ConnectionString == null ? this.CustomerConnectionString : ConnectionString;

                //string con = string.IsNullOrEmpty(ConnString) ? _ApplicationConfiguration.ConnectionString : _ApplicationConfiguration.GetConnectionString(ConnectionString);

                using (SqlConnection connection = new SqlConnection(ConnString))
                {
                    SqlCommand sqlCommand = new SqlCommand();

                    PrepareCommand(connection, sqlCommand, (SqlTransaction)null, CommandType.StoredProcedure, commandText, Parameters);
                    sqlCommand.CommandTimeout = Timeout;
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(sqlCommand);
                    DataSet dataSet = new DataSet();
                    ((DataAdapter)sqlDataAdapter).Fill(dataSet);
                    sqlCommand.Parameters.Clear();
                    return dataSet;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        private void PrepareCommand(SqlConnection connection, SqlCommand command, SqlTransaction transaction, CommandType commandType, string commandText, SqlParameter[] commandParameters)
        {


            if (connection.State != ConnectionState.Open)
                connection.Open();
            command.Connection = connection;
            command.CommandTimeout = Timeout;
            command.CommandText = commandText;
            if (transaction != null)
                command.Transaction = transaction;
            command.CommandType = commandType;
            if (commandParameters == null)
                return;
            SQLHelper.AttachParameters(command, commandParameters);
        }

        private static void AttachParameters(SqlCommand command, SqlParameter[] commandParameters)
        {
            foreach (SqlParameter sqlParameter in commandParameters)
            {
                if (sqlParameter.Direction == ParameterDirection.InputOutput && sqlParameter.Value == null)
                    sqlParameter.Value = (object)DBNull.Value;
                command.Parameters.Add(sqlParameter);
            }
        }

        public async Task<List<TElement>> SQLQueryAsync<TElement>(string sql, string ConnectionString = null, params SqlParameter[] parameters)
        {
            //string ConnectionString = connectionStringName == null ? _ApplicationConfiguration.ConnectionString : _ApplicationConfiguration.GetConnectionString(connectionStringName);

            string ConnString = ConnectionString == null ? this.CustomerConnectionString : ConnectionString;

            using (SqlConnection sqlConn = new SqlConnection(ConnString))
            {
                using (SqlCommand cmd = new SqlCommand(sql, sqlConn))
                {
                    cmd.CommandText = sql;
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.CommandTimeout = (int)TimeSpan.FromMinutes(5).TotalSeconds;
                    foreach (var parameter in parameters)
                    {
                        var paramter = cmd.CreateParameter();
                        paramter.ParameterName = parameter.ParameterName;
                        paramter.Value = parameter;
                        if (!string.IsNullOrEmpty(parameter.TypeName))
                        {
                            paramter.SqlDbType = SqlDbType.Structured;
                            paramter.TypeName = parameter.TypeName;
                        }
                        cmd.Parameters.Add(paramter);
                    }

                    sqlConn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        var result = reader.MapToList<TElement>();
                        sqlConn.Close();
                        return result;
                    }
                }
            }
        }
    }
}
