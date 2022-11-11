using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace API.Data
{
    public class DataContext : IdentityDbContext<
        AppUser,
        AppRole,
        int, // identified using an int
        IdentityUserClaim<int>, // user claim will int as key
        AppUserRole,  // user role will be mapped to the joint table
        IdentityUserLogin<int>, // user login will int as key
        IdentityRoleClaim<int>, // role claim will int as key
        IdentityUserToken<int> // user token will int as key
    >
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }
        // public DbSet<AppUser> Users { get; set; }
        public DbSet<UserLike> Likes { get; set; }
        public DbSet<Message> Messages { get; set; }

        public DbSet<Group> Groups { get; set; }
        public DbSet<Connection> Connections { get; set; }



        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder); // first of all, do the thing that the base class does 

            // configure the relationship between AppUser, AppRole through many2many relationship
            builder.Entity<AppUser>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(aur => aur.User)
                .HasForeignKey(aur => aur.UserId)
                .IsRequired();
            // and the other side of this relationship
            builder.Entity<AppRole>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(aur => aur.Role)
                .HasForeignKey(aur => aur.RoleId)
                .IsRequired();

            builder.Entity<UserLike>()
                .HasKey(k => new { k.LikedUserId, k.SourceUserId });

            builder.Entity<UserLike>()
                .HasOne(u => u.SourceUser)
                .WithMany(u => u.LikedUsers)
                .HasForeignKey(u => u.SourceUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserLike>()
                .HasOne(u => u.LikedUser)
                .WithMany(u => u.LikedByUsers)
                .HasForeignKey(u => u.LikedUserId)
                .OnDelete(DeleteBehavior.Cascade);



            builder.Entity<Message>()
           .HasOne(u => u.Sender)
           .WithMany(m => m.MessagesSent)
           .OnDelete(DeleteBehavior.Restrict);// * if the sender deletes the message, the recipient still can see it.

            builder.Entity<Message>()
                .HasOne(u => u.Recipient)
                .WithMany(m => m.MessagesReceived)
                .OnDelete(DeleteBehavior.Restrict); //restrict => if the recipient deletes the message, the sender still can see itF
        }

    }
}