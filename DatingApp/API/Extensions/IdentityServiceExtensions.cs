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

                option.Events = new JwtBearerEvents
                {
                    // * we'll configure the flow on every message event received by the hub.
                    OnMessageReceived = context =>
                    {
                        // we want the token from the query string
                        var accessToken = context.Request.Query["access_token"];
                        // check where is this request comming to
                        var path = context.HttpContext.Request.Path;
                        // if the accessToken and the the message it going to "/hubs" 
                        //  * fix 'bubs' to 'hubs' in Startup.cs
                        //  * this path ned to match the path of the hub as we configured in Startup.cs 
                        if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                        {
                            // we'll extract the token from the query string and place it in the context for the [authorize] attribute to use it.
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
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