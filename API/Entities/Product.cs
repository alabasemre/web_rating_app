namespace API.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int PhotoId { get; set; }
        public Photo Photo { get; set; }

        public IEnumerable<Comment> Comments { get; set; }
    }
}
