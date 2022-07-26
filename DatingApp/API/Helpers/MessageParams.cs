using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class MessageParams : PaginationParams
    {
        public string Username { get; set; } // currently logged in user
        public string Container { get; set; } = "Unread"; // we return by default the unread messages
        
    }
}