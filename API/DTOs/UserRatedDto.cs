using API.Entities;

namespace API.DTOs
{
    public class UserRatedDto
    {
        public string Text { get; set; }
        public int Score { get; set; }
        public ProductDto Product { get; set; }        
    }
}
