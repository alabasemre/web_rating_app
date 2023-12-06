namespace API.DTOs
{
    public class AddProductDto
    {
        public string Name { get; set; }
        public string Description { get; set; }

        public IFormFile Image { get; set; }
    }
}
