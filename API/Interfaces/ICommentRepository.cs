using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface ICommentRepository
    {
        Task<Comment> GetCommentAsync(int productId, int userId);

        Task<bool> SaveAllAsync();
    }
}
