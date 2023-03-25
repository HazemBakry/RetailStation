using System;
using System.Collections.Generic;
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
    }

}
