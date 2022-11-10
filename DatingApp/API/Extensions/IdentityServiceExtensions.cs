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

            services.AddIdentityCore<AppUser>(ops => {
                ops.Password.RequireNonAlphanumeric = false;
            })
            .AddRoles<AppRole>()
            .AddRoleManager<RoleManager<AppRole>>()
            .AddSignInManager<SignInManager<AppUser>>()
            .AddRoleValidator<RoleValidator<AppRole>>()
            .AddEntityFrameworkStores<DataContext>();



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

            return services;
            // using the extention method and go to startup.cs  
        }

    }
}