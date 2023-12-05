using API.Entities;

namespace API.DTOs
{
    public class UserDto
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public Photo Photo { get; set; }
        public string Token { get; set; }
    }
}
