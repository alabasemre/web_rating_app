using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace API.Controllers
{
    public class AuthController : BaseApiController
    {
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;

        public AuthController(ITokenService tokenService, IMapper mapper, UserManager<AppUser> userManager)
        {
            _tokenService = tokenService;
            _mapper = mapper;
            _userManager = userManager;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {

            if (await UserExists(registerDto.UserName) || await UserExistsEmail(registerDto.Email))
            {
                var options = new JsonSerializerOptions { WriteIndented = true };
                options.Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping;

                var data = new
                {
                    errors = new
                    {
                        UserName = new[] { "Kullanıcı adı veya E-posta kullanılıyor." },
                        Email = new[] { "Kullanıcı adı veya E-posta kullanılıyor." }
                    }
                };

                var resp = JsonSerializer.Serialize(data, options);

                return BadRequest(resp);
            }

            var user = _mapper.Map<AppUser>(registerDto);
            user.UserName = registerDto.UserName.ToLower();

            var result = await _userManager.CreateAsync(user, registerDto.Password);


            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            var roleResult = await _userManager.AddToRoleAsync(user, "Member");

            if (!roleResult.Succeeded) return BadRequest(roleResult.Errors);

            return new UserDto { UserName = user.UserName, Email = user.Email, Photo = user.Photo, Token = await _tokenService.CreateToken(user) };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {

            var user = await _userManager.Users.Include(p => p.Photo).SingleOrDefaultAsync(x => x.UserName == loginDto.UserName);

            if (user == null) { return Unauthorized("Invalid credentials"); }

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (!result)
            {
                return Unauthorized("Invalid password");
            }

            return new UserDto { UserName = user.UserName, Email = user.Email, Photo = user.Photo, Token = await _tokenService.CreateToken(user) };
        }

        private async Task<bool> UserExists(string username)
        {
            return await _userManager.Users.AnyAsync(x => x.UserName.ToLower() == username.ToLower());
        }

        private async Task<bool> UserExistsEmail(string email)
        {
            return await _userManager.Users.AnyAsync(x => x.Email.ToLower() == email.ToLower());
        }
    }
}
