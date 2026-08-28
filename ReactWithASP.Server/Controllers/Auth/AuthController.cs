using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactWithASP.Server.Auth.Service;
using ReactWithASP.Server.Data;
using ReactWithASP.Server.DTOs.Auth;
using ReactWithASP.Server.Entities.Auth;

namespace ReactWithASP.Server.Controllers.Auth;

[ApiController]
[Route("api/auth")]
public class AuthController(
    UserManager<ApplicationUser> userManager,
    ITokenService tokenService,
    RefreshTokenService refreshTokenService,
    AppDbContext db) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto request)
    {
        if (await userManager.FindByEmailAsync(request.Email) is not null)
            return BadRequest($"Email '{request.Email}' sudah terdaftar.");

        var user = new ApplicationUser
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            UserName = request.Email,
            Email = request.Email
        };

        var result = await userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors.Select(e => e.Description));

        await userManager.AddToRoleAsync(user, "User");
        return Ok("Registrasi berhasil.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null || !await userManager.CheckPasswordAsync(user, request.Password))
            return Unauthorized("Email atau password salah.");

        var roles = await userManager.GetRolesAsync(user);
        var (accessToken, accessExpiresAt) = tokenService.CreateToken(user, roles);
        var refreshToken = await refreshTokenService.CreateAsync(user.Id, TimeSpan.FromDays(14));

        return Ok(new
        {
            accessToken,
            accessExpiresAt,
            refreshToken = refreshToken.RawValueForResponseOnly
        });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshDto request)
    {
        var hash = refreshTokenService.Hash(request.RefreshToken);
        var stored = await db.RefreshTokens.FirstOrDefaultAsync(t => t.TokenHash == hash);

        if (stored is null)
            return Unauthorized("Refresh token tidak valid.");

        // Deteksi reuse: token ini sudah pernah dirotasi sebelumnya
        if (stored.RevokedAt is not null)
        {
            var allUserTokens = await db.RefreshTokens
                .Where(t => t.UserId == stored.UserId && t.RevokedAt == null)
                .ToListAsync();

            foreach (var t in allUserTokens)
                t.RevokedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();
            return Unauthorized("Refresh token tidak valid. Semua sesi telah dicabut.");
        }

        if (!stored.IsActive)
            return Unauthorized("Refresh token sudah kedaluwarsa.");

        var user = await userManager.FindByIdAsync(stored.UserId);
        if (user is null)
            return Unauthorized();

        // Rotasi: cabut yang lama, buat yang baru
        var newRefreshToken = await refreshTokenService.CreateAsync(user.Id, TimeSpan.FromDays(14));
        stored.RevokedAt = DateTime.UtcNow;
        stored.ReplacedByTokenHash = newRefreshToken.TokenHash;
        await db.SaveChangesAsync();

        var roles = await userManager.GetRolesAsync(user);
        var (accessToken, accessExpiresAt) = tokenService.CreateToken(user, roles);

        return Ok(new
        {
            accessToken,
            accessExpiresAt,
            refreshToken = newRefreshToken.RawValueForResponseOnly
        });
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout([FromBody] RefreshDto request)
    {
        var hash = refreshTokenService.Hash(request.RefreshToken);
        var stored = await db.RefreshTokens.FirstOrDefaultAsync(t => t.TokenHash == hash);

        if (stored is not null && stored.RevokedAt is null)
        {
            stored.RevokedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();
        }

        return Ok("Logout berhasil.");
    }
}