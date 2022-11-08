using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetUsername(this ClaimsPrincipal User)
        {
            return User.FindFirst(ClaimTypes.Name)?.Value; // (representing the UniqueName claim)
        }
    
        public static int GetUserId(this ClaimsPrincipal user)
        {
            
            return int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        }
    
    }
}