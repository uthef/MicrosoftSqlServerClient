using System.Data;
using System.Data.SqlClient;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Collections.ObjectModel;
using System.Data.Common;
using System.Text.RegularExpressions;

namespace MicrosoftSQLServerClient.Classes
{
	public static class DatabaseManagement
	{
		public const string TableListQuery = "select table_schema, table_name from INFORMATION_SCHEMA.TABLES where TABLE_TYPE = 'BASE TABLE' order by TABLE_SCHEMA, TABLE_NAME";
		public const string TableQuery = "select * from {0}.{1}";
		private static Regex Identifier = new Regex("['\"[\\]]", RegexOptions.IgnoreCase);

		public static string GetTableList(string connectionString)
		{
			SqlConnection connection = new(connectionString);

			connection.Open();

			DataTable data = new DataTable();
			SqlDataAdapter adapter = new(TableListQuery, connection);
			adapter.Fill(data);

			connection.Close();
			return JsonConvert.SerializeObject(data);
		}

		public static string GetTable(string connectionString, string schema, string name)
		{
			SqlConnection connection = new(connectionString);

			connection.Open();

			schema = Identifier.Replace(schema, "");
			name = Identifier.Replace(name, "");

			SqlCommand sqlCommand = new SqlCommand(String.Format(TableQuery, $"[{schema}]", $"[{name}]"), connection);

			SqlDataReader reader = sqlCommand.ExecuteReader();
			ReadOnlyCollection<DbColumn> columns = reader.GetColumnSchema();
			JObject response = new JObject();
			JArray columnDefs = new JArray();
			JArray rowData = new JArray();

			foreach (DbColumn column in columns)
			{
				JObject Jcolumn = new JObject();
				Jcolumn.Add("field", column.ColumnName);
				Jcolumn.Add("editable", !column.IsReadOnly);

				if (column.DataType == typeof(Int16) || column.DataType == typeof(int) || column.DataType == typeof(Int64) || column.DataType == typeof(Decimal) || column.DataType == typeof(float))
				{
					Jcolumn.Add("sortable", true);
					Jcolumn.Add("filter", "agNumberColumnFilter");
				}
				else if (column.DataType == typeof(string))
				{
					Jcolumn.Add("sortable", true);
					Jcolumn.Add("filter", "agTextColumnFilter");
				}
				else if (column.DataType == typeof(DateTime))
				{
					Jcolumn.Add("sortable", true);
					Jcolumn.Add("filter", "agDateColumnFilter");
				}
				columnDefs.Add(Jcolumn);
			}

			while (reader.Read())
			{
				JObject row = new JObject();
				
				foreach (JObject obj in columnDefs)
				{
					string colName = (string)obj["field"];
					object value = reader.GetValue(colName);
					row.Add(colName, JToken.FromObject(value));
				}
				rowData.Add(row);
			}

			reader.Close();

			response.Add("columnDefs", columnDefs);
			response.Add("rowData", rowData);

			connection.Close();
			return response.ToString();
		}
	}
}
