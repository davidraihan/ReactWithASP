using System.ComponentModel.DataAnnotations.Schema;

namespace ReactWithASP.Server.Entities.Auth
{
    public class RefreshToken
    {
        [NotMapped] public string? RawValueForResponseOnly { get; set; }
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string TokenHash { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? RevokedAt { get; set; }
        public string? ReplacedByTokenHash { get; set; }

        public bool IsActive => RevokedAt is null && DateTime.UtcNow < ExpiresAt;
    }
}
