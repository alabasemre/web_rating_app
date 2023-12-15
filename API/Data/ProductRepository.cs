using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class ProductRepository : IProductRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ProductRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ProductDto> GetProductAsync(int productId)
        {
            return await _context.Products.Where(x => x.Id == productId).ProjectTo<ProductDto>(_mapper.ConfigurationProvider).SingleOrDefaultAsync();
        }

        public async Task<PagedList<ProductDto>> GetProductsAsync(ProductParams productParams)
        {
            var query = _context.Products.ProjectTo<ProductDto>(_mapper.ConfigurationProvider).AsNoTracking();

            return await PagedList<ProductDto>.CreateAsync(query, productParams.PageNumber, productParams.PageSize);
        }

        public async Task<bool> GetProductWithNameAsync(string productName)
        {
            return await _context.Products.AnyAsync(x => x.Name == productName);
        }

        public async Task<PagedList<UserRatedDto>> GetUserRatedProductsAsync(ProductParams productParams,int userId)
       {
            var query = _context.Comments.Include(c => c.Product).Where(c => c.AppUserId == userId).ProjectTo<UserRatedDto>(_mapper.ConfigurationProvider).AsNoTracking();

            return await PagedList<UserRatedDto>.CreateAsync(query, productParams.PageNumber, productParams.PageSize);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
