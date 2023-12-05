using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "Kullanıcı Adı Boş Geçilemez.")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "E-Posta Adresi Boş Geçilemez.")]
        [EmailAddress(ErrorMessage = "Lütfen Geçerli Bir Mail Adresi Girin.")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Şifre Boş Geçilemez.")]
        public string Password { get; set; }
    }
}
