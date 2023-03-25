using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Common;
using MasterErp.Service.Common;

namespace MasterErp.Service.Common
{

    public class SQLHelper : ISQLHelper
    {

        int Timeout = 9999;

        public List<TElement> SQLQuery<TElement>(string CommandText, string ConnectionString, params SqlParameter[] Parameters)
        {
            //string ConnectionString = connectionStringName == null ? _ApplicationConfiguration.ConnectionString : _ApplicationConfiguration.GetConnectionString(connectionStringName);
            using (SqlConnection sqlConn = new SqlConnection(ConnectionString))
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

        public List<TElement> SQLQuery<TElement>(string CommandText, string ConnectionString, CommandType commandType = CommandType.StoredProcedure, params SqlParameter[] Parameters)
        {
            //string ConnectionString = connectionStringName == null ? _ApplicationConfiguration.ConnectionString : _ApplicationConfiguration.GetConnectionString(connectionStringName);
            using (SqlConnection sqlConn = new SqlConnection(ConnectionString))
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

        public object ExecuteScalar(string CommandText, string ConnectionString, params SqlParameter[] Parameters)
        {
            using (SqlConnection sqlConn = new SqlConnection(ConnectionString))//_ApplicationConfiguration.ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand(ConnectionString, sqlConn))
                {
                    cmd.CommandText = ConnectionString;
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

        public int ExecuteNonQuery(string CommandText, string ConnectionString, params SqlParameter[] Parameters)
        {
            //string ConnectionString = connectionStringName == null ? _ApplicationConfiguration.ConnectionString : _ApplicationConfiguration.GetConnectionString(connectionStringName);
            using (SqlConnection connection = new SqlConnection(ConnectionString))
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
                catch (Exception ex)
                {
                    return ret;
                }
                command.Parameters.Clear();
                return ret;
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

        public DataSet ExecuteDataset(string commandText, string ConnectionString, SqlParameter[] Parameters)
        {
            try
            {
                //string con = string.IsNullOrEmpty(ConnectionString) ? _ApplicationConfiguration.ConnectionString : _ApplicationConfiguration.GetConnectionString(ConnectionString);

                using (SqlConnection connection = new SqlConnection(ConnectionString))
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
            catch (Exception ex)
            {
                throw ex;
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

        public async Task<List<TElement>> SQLQueryAsync<TElement>(string sql, string ConnectionString, params SqlParameter[] parameters)
        {
            //string ConnectionString = connectionStringName == null ? _ApplicationConfiguration.ConnectionString : _ApplicationConfiguration.GetConnectionString(connectionStringName);
            using (SqlConnection sqlConn = new SqlConnection(ConnectionString))
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
