using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;
namespace ReactWithASP.Server.Entities.Auth;

public class ApplicationUser : IdentityUser
{
    [NotMapped] public string? RawValueForResponseOnly { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}