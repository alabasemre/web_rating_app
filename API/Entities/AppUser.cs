using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser : IdentityUser<int>
    {
        public int? PhotoId { get; set; }
        public Photo Photo { get; set; }

        public IEnumerable<Comment> Comments { get; set; }

        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}
