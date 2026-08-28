using ReactWithASP.Server.Entities.Auth;

namespace ReactWithASP.Server.Auth.Service;

public interface ITokenService
{
    (string Token, DateTime ExpiresAt) CreateToken(ApplicationUser user, IEnumerable<string> roles);
}
