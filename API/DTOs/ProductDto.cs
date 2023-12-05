using API.Entities;

namespace API.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Photo Photo { get; set; }

        public IEnumerable<CommentDto> Comments { get; set; }
    }
}
