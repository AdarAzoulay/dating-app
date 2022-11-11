using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            // we want to map AppUser => MemberDto
            CreateMap<AppUser, MemberDto>()
            .ForMember(
                dest => dest.PhotoUrl,
                opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url)
            )
            .ForMember(
                dest => dest.Age,
                opt => opt.MapFrom(d => d.DateOfBirth.CalculateAge())
            );

            // we want to map Photo => PhotoDto
            CreateMap<Photo, PhotoDto>();

            // we want to map MemberUpdateDTO => AppUser
            CreateMap<MemberUpdateDTO, AppUser>();

            CreateMap<RegisterDTO, AppUser>();

            CreateMap<Message, MessageDto>()
            .ForMember(
                dest => dest.SenderPhotoUrl,// we mapping to SenderPhotoUrl 
                opt => opt.MapFrom(         // we mapping from the senders photos, the one that is main
                    src => src.Sender.Photos.FirstOrDefault(x => x.IsMain).Url))
            .ForMember(
                dest => dest.RecipientPhotoUrl,// we mapping to RecipientPhotoUrl 
                opt => opt.MapFrom(            // we mapping from the Recipient photos, the one that is main
                    src => src.Recipient.Photos.FirstOrDefault(x => x.IsMain).Url));

            CreateMap<DateTime,DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));

        }
    }
}