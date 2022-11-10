using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
        {

            services.AddIdentityCore<AppUser>(ops =>
            {
                ops.Password.RequireNonAlphanumeric = false;
            })
            .AddRoles<AppRole>() //we want to use roles in our app
            .AddRoleManager<RoleManager<AppRole>>() //need to add the role manager
            .AddSignInManager<SignInManager<AppUser>>() //also we need the signing in manager that uses the AppUser
            .AddRoleValidator<RoleValidator<AppRole>>() //we also need the validation of roles, to work with AppRole as the role type
            .AddEntityFrameworkStores<DataContext>(); //and all the above need to be stored in a persistent way so add the store:



            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(option => // 2. configure parameters 
            {
                option.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(config["TokenKey"])),
                    ValidateIssuer = false, // the api server 
                    ValidateAudience = false // the angular app 
                };
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
                options.AddPolicy("ModeratePhotoRole", policy => policy.RequireRole("Admin", "Moderator"));
            });

            return services;
            // using the extention method and go to startup.cs  
        }

    }
}