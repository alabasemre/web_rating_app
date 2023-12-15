namespace API.DTOs
{
    public class CommentDto
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public int Score { get; set; }

        public string UserName { get; set; }
        public string ImgUrl { get; set; }
    }
}
