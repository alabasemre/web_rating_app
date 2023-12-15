namespace API.DTOs
{
    public class AddCommentDto
    {
        public int ProductId { get; set; }
        public string CommentText { get; set; }
        public int Score { get; set; }
    }
}
