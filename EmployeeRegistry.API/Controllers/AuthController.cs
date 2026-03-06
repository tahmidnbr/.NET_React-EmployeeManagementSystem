using Microsoft.AspNetCore.Mvc;
using EmployeeRegistry.API.Auth;

namespace EmployeeRegistry.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly JwtTokenService _jwt;

    public AuthController(JwtTokenService jwt) => _jwt = jwt;

    // POST /api/auth/login
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var user = UserStore.Validate(request.Username, request.Password);
        if (user is null)
            return Unauthorized(new { message = "Invalid username or password." });

        var response = _jwt.GenerateToken(user);
        return Ok(response);
    }
}