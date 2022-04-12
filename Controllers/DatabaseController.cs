using Microsoft.AspNetCore.Mvc;
using MicrosoftSQLServerClient.Models;
using MicrosoftSQLServerClient.Classes;

namespace MicrosoftSQLServerClient.Controllers
{
    [Route("/{controller=Database}/{action=Index}")]
    public class DatabaseController : Controller
    {
        public IActionResult Index()
        {
            if (Request.HttpContext.Session.GetString("Connection") == null) return Redirect("/");
            else return View(new DatabaseModel() { Name = Request.HttpContext.Session.GetString("DatabaseName")});
        }

        [HttpPost]
        public string? GetTableList()
		{
            string? conn = Request.HttpContext.Session.GetString("Connection");
            if (conn == null) return null;
            else return DatabaseManagement.GetTableList(conn);
		}

        [HttpPost]
        public string? GetTable(string schema, string table)
		{
            string? conn = Request.HttpContext.Session.GetString("Connection");
            if (conn != null) return DatabaseManagement.GetTable(conn, schema, table);
            return null;
        }
    }
}
