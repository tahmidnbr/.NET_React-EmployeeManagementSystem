namespace EmployeeRegistry.API.Auth;

// ── Request / Response DTOs ───────────────────────────────────

public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginResponse
{
    public string Token     { get; set; } = string.Empty;
    public string Username  { get; set; } = string.Empty;
    public string Role      { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}

// ── Hardcoded Users + Validation ─────────────────────────────

public static class UserStore
{
    public record AppUser(string Username, string Password, string Role);

    private static readonly List<AppUser> Users = new()
    {
        new AppUser("admin",  "admin123",  "Admin"),
        new AppUser("viewer", "viewer123", "Viewer"),
    };

    public static AppUser? Validate(string username, string password) =>
        Users.FirstOrDefault(u =>
            u.Username == username && u.Password == password);
}