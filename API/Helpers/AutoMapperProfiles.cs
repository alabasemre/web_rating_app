using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, UserDto>();
            CreateMap<RegisterDto, AppUser>();
            CreateMap<Photo, PhotoDto>();
            CreateMap<Product, ProductDto>();
            CreateMap<Comment, CommentDto>().ForMember(comment => comment.UserName, opt => opt.MapFrom(src => src.AppUser.UserName));
        }
    }
}
