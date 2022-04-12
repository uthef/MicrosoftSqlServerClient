using Microsoft.AspNetCore.Mvc;
using MicrosoftSQLServerClient.Models;
using System.Data.SqlClient;
using System.Text.Json;

namespace MicrosoftSQLServerClient.Controllers
{
    [Route("/{action=Index}")]
    public class MainController : Controller
    {
        public IActionResult Index()
        {
            if (Request.HttpContext.Session.GetString("Connection") != null) return Redirect("/Database");
            else return View();
        }

        [HttpPost]
        public void Connect(ConnectionRequestModel model)
        {
            if (model.Server == null || model.Server.Trim().Length == 0 || model.Database == null || model.Database.Trim().Length == 0)
            {
                Response.StatusCode = 400;
                return;
            }

            try
            {
                SqlConnection connection = new($"Server={model.Server};User Id={model.UserId};Password={model.Password};Database={model.Database};Trusted_Connection=true");
                connection.Open();
                Request.HttpContext.Session.SetString("Connection", connection.ConnectionString);
                Request.HttpContext.Session.SetString("DatabaseName", connection.Database);
                connection.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Response.StatusCode = 500;
            }
        }

        public IActionResult Logout()
        {
            Request.HttpContext.Session.Remove("Connection");
            return Redirect("/");
        }
    }
}
