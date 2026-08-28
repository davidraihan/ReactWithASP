using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactWithASP.Server.Data;
using ReactWithASP.Server.DTOs.Main;
using ReactWithASP.Server.Models.Main;

namespace ProductApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }

        // GET: api/products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        // POST: api/products
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(ProductCreateRequest request)
        {
            var randomSku = string.IsNullOrWhiteSpace(request.Sku) 
                ? $"SKU-{new Random().Next(1000, 9999)}" 
                : request.Sku;

            var defaultImg = string.IsNullOrWhiteSpace(request.Image)
                ? "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=60"
                : request.Image;

            var product = new Product
            {
                Name = request.Name,
                Sku = randomSku,
                Category = string.IsNullOrWhiteSpace(request.Category) ? "General" : request.Category,
                Price = request.Price,
                Stock = request.Stock,
                Status = request.Stock > 5 ? "in_stock" : request.Stock > 0 ? "low_stock" : "out_of_stock",
                Description = request.Description,
                Image = defaultImg,
                SalesCount = 0
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        // PUT: api/products/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, ProductUpdateRequest request)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            product.Name = request.Name;
            product.Sku = request.Sku;
            product.Category = request.Category;
            product.Price = request.Price;
            product.Stock = request.Stock;
            product.Status = request.Stock > 5 ? "in_stock" : request.Stock > 0 ? "low_stock" : "out_of_stock";
            product.Description = request.Description;
            if (!string.IsNullOrWhiteSpace(request.Image))
            {
                product.Image = request.Image;
            }

            await _context.SaveChangesAsync();
            return Ok(product);
        }

        // DELETE: api/products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}