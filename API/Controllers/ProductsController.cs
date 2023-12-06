using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IUserRepository _userRepository;
        private readonly IProductRepository _productRepository;
        private readonly IPhotoService _photoService;

        public ProductsController(DataContext context, IUserRepository userRepository, IProductRepository productRepository, IPhotoService photoService)
        {
            _context = context;
            _userRepository = userRepository;
            _productRepository = productRepository;
            _photoService = photoService;
        }


        [HttpGet]
        public async Task<ActionResult<PagedList<ProductDto>>> GetProducts([FromQuery] ProductParams productParams)
        {
            var products = await _productRepository.GetProductsAsync(productParams);

            Response.AppPaginationHeader(new PaginationHeader(products.CurrentPage, products.PageSize, products.TotalCount, products.TotalPages));

            return Ok(products);
        }


        [HttpPost("add")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<ProductDto>> AddProduct([FromForm] AddProductDto addProductDto)
        {
            if (addProductDto == null || addProductDto.Image == null)
            {
                return BadRequest("Product or image is null");
            }

            if (await _productRepository.GetProductWithNameAsync(addProductDto.Name))
            {
                return BadRequest("Product is already exists!");
            }

            var result = await _photoService.AddPhotoAsync(addProductDto.Image);

            if (result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            var Product = new Product
            {
                Comments = null,
                Photo = photo,
                Name = addProductDto.Name,
                Description = addProductDto.Description,
            };

            _context.Products.Add(Product);


            if (await _productRepository.SaveAllAsync())
            {
                return new ProductDto { Id = Product.Id, Name = Product.Name, Description = Product.Description, Photo = Product.Photo, Comments = Array.Empty<CommentDto>() };
            }

            return BadRequest("Something went wrong!!!");
        }



    }
}
