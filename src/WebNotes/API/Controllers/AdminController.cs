using API.Configuration;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = Roles.Admin)]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public AdminController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("[action]")]
        public IActionResult Statistic()
        {
            var statistic = _dbContext.Users.Include(u => u.Notes)
                            .Where(x => x.Role == Roles.User)
                            .Select(x => new 
                            {
                                user = x.Username,
                                notesCount = x.Notes.Count
                            });
            
            return Ok(statistic);
        }

        [HttpDelete("[action]/{username}")]
        public async Task<IActionResult> DeleteAccount(string username)
        {
            var user = await _dbContext.Users.Include(u => u.Notes).FirstOrDefaultAsync(x => x.Username == username);
            if (user == null)
            {
                return BadRequest($"Account '{username}' doesn't exist");
            }

            _dbContext.Users.Remove(user);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }
    }
}