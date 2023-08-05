using API.Services;
using API.Configuration;
using API.Model;
using API.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ICryptographyService _cryptographyService;
        private readonly AppDbContext _dbContext;

        public AuthenticationController(
            IConfiguration configuration,
            ICryptographyService cryptographyService,
            AppDbContext dbContext)
        {
            _configuration = configuration;
            _cryptographyService = cryptographyService;
            _dbContext = dbContext;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Login([FromBody] UserDTO userDTO)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Username == userDTO.Username);
            if (user == null || user.Password != _cryptographyService.GetSha256Hash(userDTO.Password))
            {
                return Unauthorized();
            }

            return Ok(new
            {
                userDTO.Username,
                role = user.Role,
                jwtToken = GetJwtToken(user.Username, user.Role)
            });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Register([FromBody] UserDTO userDTO)
        {
            var existingUser = await _dbContext.Users.FirstOrDefaultAsync(x => x.Username == userDTO.Username);
            if (existingUser != null)
            {
                return BadRequest(new
                {
                    userDTO.Username,
                    accountExists = true
                });
            }

            var newUser = new User
            {
                Username = userDTO.Username,
                Password = _cryptographyService.GetSha256Hash(userDTO.Password),
                Role = Roles.User
            };
            _dbContext.Users.Add(newUser);
            await _dbContext.SaveChangesAsync();

            return Ok(new
            {
                userDTO.Username,
                role = newUser.Role,
                jwtToken = GetJwtToken(newUser.Username, newUser.Role)
            });
        }

        private string GetJwtToken(string username, string role)
        {
            var authenticationSettings = _configuration.GetSection(ConfigurationSections.Authentication).Get<AuthenticationSettings>();
            var claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, username),
                new Claim(ClaimsIdentity.DefaultRoleClaimType, role)
            };
            var jwtToken = new JwtSecurityToken(
                issuer: authenticationSettings.Issuer,
                claims: claims,
                expires: DateTime.UtcNow.Add(authenticationSettings.ExpiryPeriod),
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authenticationSettings.Key)),
                    SecurityAlgorithms.HmacSha256));
            return new JwtSecurityTokenHandler().WriteToken(jwtToken);
        }
    }
}