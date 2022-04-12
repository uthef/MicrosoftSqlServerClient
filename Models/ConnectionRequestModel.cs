﻿using System.ComponentModel.DataAnnotations;

namespace MicrosoftSQLServerClient.Models
{
    public class ConnectionRequestModel
    {
        public string Server { get; set; }
        public string Database { get; set; }
        public string UserId { get; set; }
        public string Password { get; set; }    
    }
}
