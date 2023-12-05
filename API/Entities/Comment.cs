namespace API.Entities
{
    public class Comment
    {
        public int Id { get; set; }
        public string Text { get; set; }

        public int Score { get; set; }
        public int AppUserId { get; set; }
        public AppUser AppUser { get; set; }

        public int ProductId { get; set; }

        public Product Product { get; set; }
    }
}
