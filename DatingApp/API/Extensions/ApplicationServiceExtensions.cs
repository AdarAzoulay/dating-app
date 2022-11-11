using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using API.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            // 3 types of service lifetimes after we start it:
            // AddSingleton: dies (disposed) with the application (too long for service we need on the api call level)
            // AddScoped: dies(disposed) with the http request ( in this case its scoped to the request, we create it on http call (injected to the controller), most useful in Web Apps)
            // AddTransient: dies(disposed) on method finishing, created every time they are injected or requested.

            services.AddSingleton<PresenceTracker>();

            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));

            services.AddScoped<ITokenService, TokenService>();

            services.AddScoped<ILikesRepository, LikesRepository>();

            services.AddScoped<IMessageRepository, MessageRepository>();

            services.AddScoped<LogUserActivity>();

            services.AddScoped<IUserRepository, UserRepository>();

            services.AddScoped<IPhotoService, PhotoService>();

            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);

            services.AddDbContext<DataContext>(options =>
            {
                options.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });

            return services;
        }
    }
}