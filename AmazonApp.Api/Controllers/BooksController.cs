using AmazonApp.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AmazonApp.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class BooksController(BookstoreContext context) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetBooks(int pageSize = 5, int pageNum = 1, string sortOrder = "asc")
    {
        if (pageSize < 1)
        {
            pageSize = 5;
        }

        if (pageNum < 1)
        {
            pageNum = 1;
        }

        var query = context.Books.AsQueryable();

        query = sortOrder.ToLower() == "desc"
            ? query.OrderByDescending(b => b.Title)
            : query.OrderBy(b => b.Title);

        var totalNumBooks = await context.Books.CountAsync();

        var books = await query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new
        {
            Books = books,
            TotalNumBooks = totalNumBooks
        });
    }
}
