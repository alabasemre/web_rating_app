using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IUserRepository _userRepository;
        private readonly IProductRepository _productRepository;
        private readonly IPhotoService _photoService;
        private readonly IMapper _mapper;

        public ProductsController(DataContext context, IUserRepository userRepository, IProductRepository productRepository, IPhotoService photoService, IMapper mapper)
        {
            _context = context;
            _userRepository = userRepository;
            _productRepository = productRepository;
            _photoService = photoService;
            _mapper = mapper;
        }


        [HttpGet]
        public async Task<ActionResult<PagedList<ProductDto>>> GetProducts([FromQuery] ProductParams productParams)
        {
            var products = await _productRepository.GetProductsAsync(productParams);

            Response.AppPaginationHeader(new PaginationHeader(products.CurrentPage, products.PageSize, products.TotalCount, products.TotalPages));

            return Ok(products);
        }

        [Authorize]
        [HttpGet("user-rated")]
        public async Task<ActionResult<ProductDto>> GetUserRatedProducts([FromQuery] ProductParams productParams)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());         

            var products = await _productRepository.GetUserRatedProductsAsync(productParams, user.Id);

            Response.AppPaginationHeader(new PaginationHeader(products.CurrentPage, products.PageSize, products.TotalCount, products.TotalPages));

            return Ok(products);
        }

        [HttpGet("{productId}")]
        public async Task<ActionResult<PagedList<ProductDto>>> GetProduct(int productId)
        {
            var product = await _productRepository.GetProductAsync(productId);
            if (product == null)
            {
                return BadRequest("Product does not exists!");
            }

            return Ok(product);
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

        [HttpPut("{productId}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<ProductDto>> UpdateProduct([FromForm] AddProductDto addProductDto, int productId)
        {
            var product = await _context.Products.Include(p => p.Photo).Where(x => x.Id == productId).SingleOrDefaultAsync();

            if (product == null)
            {
                return NotFound();
            }

            if (product.Name == addProductDto.Name && product.Description == addProductDto.Description && addProductDto.Image == null)
            {
                return BadRequest("You did not change any property...");
            }

            ImageUploadResult result;
            Photo photo = null;
            if (addProductDto.Image != null)
            {
                if (product.Photo.PublicId != null)
                {
                    result = await _photoService.AddPhotoAsync(addProductDto.Image);
                    if (result.Error != null)
                    {
                        return BadRequest(result.Error.Message);
                    }
                    photo = new Photo
                    {
                        Url = result.SecureUrl.AbsoluteUri,
                        PublicId = result.PublicId
                    };
                   
                    DeletionResult deletionResult = await _photoService.DeletePhotoAsync(product.Photo.PublicId);
                    if (deletionResult.Error != null)
                    {
                        return BadRequest(result.Error.Message);
                    }
                }
            }

          
            if (photo != null)
            {
                var oldPhoto = await _context.Photos.SingleOrDefaultAsync(x => x.Id == product.Photo.Id);
                oldPhoto.PublicId = photo.PublicId;
                oldPhoto.Url = photo.Url;
                product.Photo = oldPhoto;
            }

            product.Name = addProductDto.Name;
            product.Description = addProductDto.Description;

            if (await _productRepository.SaveAllAsync())
            {
                IEnumerable<CommentDto> comments = new List<CommentDto>();
                if (product.Comments != null)                {
                    comments = (IEnumerable < CommentDto >) product.Comments;
                }
        
              
                return new ProductDto { Id = product.Id, Name = product.Name, Description = product.Description, Photo = product.Photo, Comments = comments };
            }


            return BadRequest("Problem deleting product");
        }

        [HttpDelete("{productId}") ]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult> DeleteProduct(int productId)
        {
            var product = await _context.Products.Include(p => p.Photo).Where(x => x.Id == productId).SingleOrDefaultAsync();
           
            if (product == null)
            {
                return NotFound();
            }

            if (product.Photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(product.Photo.PublicId);
                if (result.Error != null)
                {
                    return BadRequest(result.Error.Message);
                }
            }

            _context.Products.Remove(product);

            if (await _productRepository.SaveAllAsync())
            {
                return Ok();
            }

            return BadRequest("Problem deleting product");
        }

    }
}
