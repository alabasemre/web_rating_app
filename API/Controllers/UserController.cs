using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class UserController:BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        private readonly DataContext _context;

        public UserController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService, DataContext context)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _photoService = photoService;
            _context = context;
        }

        [Authorize]
        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var userN = User.GetUsername();
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            if (user == null)
            {
                return NotFound("User not found");
            }

            if (file == null)
            {
                return BadRequest("File is empty");
            }

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            //var photo = new Photo
            //{
            //    Url = "2121",
            //    PublicId = "2121"
            //};

            if (user.Photo != null)
            {
                var oldPhoto = await _context.Photos.SingleOrDefaultAsync(x => x.Id == user.Photo.Id);
                var publicId = oldPhoto.PublicId;
                oldPhoto.PublicId = photo.PublicId;
                oldPhoto.Url = photo.Url;

                await _photoService.DeletePhotoAsync(publicId);
            }
            else
            {
                user.Photo = photo;
            }

            if (await _userRepository.SaveAllAsync())
            {
                return CreatedAtAction(nameof(GetUser), new { username = user.UserName }, _mapper.Map<PhotoDto>(photo));
            }

            return BadRequest("Problem Adding Photo");
        }

       
        public async Task<ActionResult<AppUser>> GetUser(string username)
        {
            return await _userRepository.GetUserByUsernameAsync(username);
        }
    }
}
