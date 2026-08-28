using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactWithASP.Server.DTOs.Auth;
using ReactWithASP.Server.Entities.Auth;

namespace ReactWithASP.Server.Controllers.Auth
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UsersController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            var list = new List<UserResponseDto>();

            foreach (var u in users)
            {
                var roles = await _userManager.GetRolesAsync(u);
                var primaryRole = roles.FirstOrDefault() ?? "User";

                list.Add(new UserResponseDto
                {
                    Id = u.Id,
                    FirstName = u.FirstName ?? string.Empty,
                    LastName = u.LastName ?? string.Empty,
                    Username = u.UserName ?? string.Empty,
                    Email = u.Email ?? string.Empty,
                    PhoneNumber = u.PhoneNumber ?? string.Empty,
                    Status = "active",
                    Role = primaryRole.ToLower(),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                });
            }

            return Ok(list);
        }

        // GET: api/users/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponseDto>> GetUser(string id)
        {
            var u = await _userManager.FindByIdAsync(id);
            if (u == null) return NotFound();

            var roles = await _userManager.GetRolesAsync(u);
            var primaryRole = roles.FirstOrDefault() ?? "User";

            return Ok(new UserResponseDto
            {
                Id = u.Id,
                FirstName = u.FirstName ?? string.Empty,
                LastName = u.LastName ?? string.Empty,
                Username = u.UserName ?? string.Empty,
                Email = u.Email ?? string.Empty,
                PhoneNumber = u.PhoneNumber ?? string.Empty,
                Status = "active",
                Role = primaryRole.ToLower(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        // POST: api/users
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
        {
            if (await _userManager.FindByEmailAsync(request.Email) != null)
                return BadRequest($"Email '{request.Email}' is already registered.");

            var user = new ApplicationUser
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                UserName = request.Email,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors.Select(e => e.Description));

            string roleName = string.IsNullOrWhiteSpace(request.Role) ? "User" : request.Role;
            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                await _roleManager.CreateAsync(new IdentityRole(roleName));
            }
            await _userManager.AddToRoleAsync(user, roleName);

            return Ok(new UserResponseDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Username = user.UserName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Status = request.Status,
                Role = roleName.ToLower(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        // PUT: api/users/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserRequest request)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.PhoneNumber = request.PhoneNumber;

            await _userManager.UpdateAsync(user);

            if (!string.IsNullOrWhiteSpace(request.Role))
            {
                var currentRoles = await _userManager.GetRolesAsync(user);
                await _userManager.RemoveFromRolesAsync(user, currentRoles);

                if (!await _roleManager.RoleExistsAsync(request.Role))
                {
                    await _roleManager.CreateAsync(new IdentityRole(request.Role));
                }
                await _userManager.AddToRoleAsync(user, request.Role);
            }

            return Ok(new UserResponseDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Username = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                PhoneNumber = user.PhoneNumber ?? string.Empty,
                Status = request.Status,
                Role = (request.Role ?? "user").ToLower(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        // DELETE: api/users/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();

            await _userManager.DeleteAsync(user);
            return NoContent();
        }
    }
}
