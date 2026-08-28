using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ReactWithASP.Server.Entities.Auth;
using ReactWithASP.Server.Models.Main;

namespace ReactWithASP.Server.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options)
    : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;
    public DbSet<Product> Products => Set<Product>();
    public DbSet<TaskItem> Tasks => Set<TaskItem>();
}
