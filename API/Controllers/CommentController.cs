using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CommentController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IUserRepository _userRepository;
        private readonly IProductRepository _productRepository;
        private readonly ICommentRepository _commentRepository;

        public CommentController(DataContext context, IUserRepository userRepository, IProductRepository productRepository, ICommentRepository commentRepository)
        {
            _context = context;
            _userRepository = userRepository;
            _productRepository = productRepository;
            _commentRepository = commentRepository;
        }

        [HttpPost("add")]
        [Authorize]
        public async Task<ActionResult<CommentDto>> AddComment(AddCommentDto addCommentDto)
        {
            var product = await _productRepository.GetProductAsync(addCommentDto.ProductId);
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            if (product == null || user == null)
            {
                return BadRequest("Product or user does not exist");
            }

            var isExistComment = await _commentRepository.GetCommentAsync(addCommentDto.ProductId, user.Id);

            if (isExistComment == null)
            {
                if (addCommentDto.Score == 0)
                {
                    return BadRequest("You should rate the product first!");
                }
                Comment comment = new Comment { AppUser = user, ProductId = addCommentDto.ProductId, Text = addCommentDto.CommentText, Score = addCommentDto.Score };
                _context.Comments.Add(comment);

                if (await _commentRepository.SaveAllAsync())
                {
                    return new CommentDto { Id = comment.Id, UserName = comment.AppUser.UserName, Score = comment.Score, Text = comment.Text,ImgUrl = comment.AppUser.Photo.Url };
                }
            }

            if (isExistComment.Text != addCommentDto.CommentText || isExistComment.Score != addCommentDto.Score)
            {
                
                 isExistComment.Text = addCommentDto.CommentText;               

                if (addCommentDto.Score != 0)
                {
                    isExistComment.Score = addCommentDto.Score;    
                }


                if (await _commentRepository.SaveAllAsync())
                {
                    return new CommentDto { Id = isExistComment.Id, UserName = user.UserName, Score = isExistComment.Score, Text = isExistComment.Text, ImgUrl = user.Photo.Url };
                }
            }

            return BadRequest();
        }
    }
}
