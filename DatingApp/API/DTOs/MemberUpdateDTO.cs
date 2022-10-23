using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class MemberUpdateDTO
    {
        public int Introduction { get; set; }
        public int LookingFor { get; set; }
        public int Interests { get; set; }
        public int City { get; set; }
        public int Country { get; set; }
    }
}