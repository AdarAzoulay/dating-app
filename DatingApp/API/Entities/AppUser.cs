using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser : IdentityUser<int>
    {
        // public int Id { get; set; }
        // public string UserName { get; set; }

        // public byte[] PasswordHash { get; set; }
        // public byte[] PasswordSalt { get; set; }


        public DateTime DateOfBirth { get; set; }
        public string KnownAs { get; set; }
        public DateTime Created { get; set; } = DateTime.Now; // initial value
        public DateTime LastActive { get; set; } = DateTime.Now;

        public string Gender { get; set; }
        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }

        public string City { get; set; }
        public string Country { get; set; }

        public ICollection<Photo> Photos { get; set; }

        // public int GetAge()
        // {
        //     return DateOfBirth.CalculateAge();
        // }

        public ICollection<UserLike> LikedByUsers { get; set; } //1. add the collection: who liked this currently logged in user
        public ICollection<UserLike> LikedUsers { get; set; }//2. add the collection: who this user liked

        public ICollection<Message> MessagesSent { get; set; }
        public ICollection<Message> MessagesReceived { get; set; }


        public ICollection<AppUserRole> UserRoles { get; set; }

    }
}