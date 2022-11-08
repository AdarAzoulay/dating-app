using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class UserParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int _pageSize = 10; // default page size
        public int PageSize
        {
            get => _pageSize; // getter
            set => _pageSize = Math.Min(MaxPageSize, value); // setter
        }

        public string CurrnetUsername { get; set; }

        public string Gender { get; set; }
        public int MinAge { get; set; } = 18;// we don't allow ages under 18
        public int MaxAge { get; set; } = 150;// this will sure give us all the users

        public string OrderBy { get; set; } = "lastActive";


    }
}