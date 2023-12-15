using API.DTOs;
using API.Helpers;

namespace API.Interfaces
{
    public interface IProductRepository
    {
        Task<ProductDto> GetProductAsync(int productId);

        Task<bool> GetProductWithNameAsync(string productName);
        Task<PagedList<ProductDto>> GetProductsAsync(ProductParams productParams);
        Task<PagedList<UserRatedDto>> GetUserRatedProductsAsync(ProductParams productParams, int userId);

        Task<bool> SaveAllAsync();
    }
}
