using Microsoft.EntityFrameworkCore;
using ReactWithASP.Server.Data;
using ReactWithASP.Server.Entities.Auth;
using System.Security.Cryptography;
using System.Text;

namespace ReactWithASP.Server.Auth.Service;

public class RefreshTokenService(AppDbContext db)
{
    public string GenerateRefreshTokenValue()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(bytes);
    }

    public string Hash(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(bytes);
    }

    public async Task<RefreshToken> CreateAsync(string userId, TimeSpan lifetime)
    {
        var raw = GenerateRefreshTokenValue();
        var entity = new RefreshToken
        {
            UserId = userId,
            TokenHash = Hash(raw),
            ExpiresAt = DateTime.UtcNow.Add(lifetime)
        };

        db.RefreshTokens.Add(entity);
        await db.SaveChangesAsync();

        entity.RawValueForResponseOnly = raw;
        return entity;
    }
}