using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class UserParams : PaginationParams
    {

        public string CurrnetUsername { get; set; }

        public string Gender { get; set; }
        public int MinAge { get; set; } = 18;// we don't allow ages under 18
        public int MaxAge { get; set; } = 150;// this will sure give us all the users

        public string OrderBy { get; set; } = "lastActive";


    }
}