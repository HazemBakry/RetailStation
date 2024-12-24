using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Reflection;

namespace MasterErp.Service.Common
{

    internal static class DalHelper
    {
        public static List<T> MapToList<T>(this DbDataReader dr)
        {
            var objList = new List<T>();
            var props = typeof(T).GetRuntimeProperties();

            List<string> drColumnsName = new List<string>();
            for (int i = 0; i < dr.FieldCount; i++)
            {
                drColumnsName.Add(dr.GetName(i));
            }


            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    T obj = Activator.CreateInstance<T>();
                    foreach (var prop in props)
                    {
                        if (drColumnsName.Contains(prop.Name))
                        {
                            var ordinal = dr.GetOrdinal(prop.Name);
                            var val = dr.GetValue(ordinal);
                            prop.SetValue(obj, val == DBNull.Value ? null : val);
                        }
                    }
                    objList.Add(obj);
                }
            }
            return objList;
        }
        public static DataTable ConvertToDataTable<T>(List<T> items, string tableName = "")
        {

            var ResultJson = JsonConvert.SerializeObject(items);
            var dataTable = (DataTable)JsonConvert.DeserializeObject(ResultJson, (typeof(DataTable)));
            dataTable.TableName = !string.IsNullOrEmpty(tableName) ? tableName : typeof(T).Name;

            //var dataTable = new DataTable(typeof(T).Name);

            //// Get all the properties
            //var props = typeof(T).GetProperties(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance);

            //// Create columns
            //foreach (var prop in props)
            //{
            //    dataTable.Columns.Add(prop.Name, prop.PropertyType);
            //}

            //// Populate rows
            //foreach (var item in items)
            //{
            //    var values = new object[props.Length];
            //    for (int i = 0; i < props.Length; i++)
            //    {
            //        values[i] = props[i].GetValue(item, null);
            //    }
            //    dataTable.Rows.Add(values);
            //}

            return dataTable;
        }

    }

}
