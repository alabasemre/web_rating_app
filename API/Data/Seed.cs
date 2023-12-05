using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            if (await roleManager.Roles.AnyAsync())
            {
                return;
            }

            var roles = new List<AppRole>
            {
                new AppRole{Name = "Member"},
                new AppRole{Name = "Admin"}
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            var adminUser = new AppUser
            {
                UserName = "admin",
                Email = "admin@mail.com",
            };

            await userManager.CreateAsync(adminUser, "123456");
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }
    }
}
