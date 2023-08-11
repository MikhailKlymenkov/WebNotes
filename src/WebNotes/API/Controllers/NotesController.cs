using API.Configuration;
using API.DTO;
using API.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = Roles.User)]
    public class NotesController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public NotesController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet()]
        public async Task<IActionResult> GetNotes()
        {
            var user = await GetUser();
            if (user == null)
            {
                return UserNotFound();
            }

            var notes = user.Notes.Select(x => new
            {
                id = x.Id,
                title = x.Title,
                creationDate = x.CreationDate
            });

            return Ok(notes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetNote(int id)
        {
            var user = await GetUser();
            if (user == null)
            {
                return UserNotFound();
            }

            var note = user.Notes.FirstOrDefault(x => x.Id == id);
            if (note == null)
            {
                return NoteNotFound(id);
            }

            return Ok(new
            {
                id = note.Id,
                title = note.Title,
                creationDate = note.CreationDate,
                body = note.Body,
                isEdited = note.IsEdited
            });
        }

        [HttpPost()]
        public async Task<IActionResult> AddNote([FromBody] NoteDto noteDto)
        {
            var user = await GetUser();
            if (user == null)
            {
                return UserNotFound();
            }

            var note = new Note
            {
                Title = noteDto.Title,
                Body = noteDto.Body,
                CreationDate = DateTime.UtcNow,
                IsEdited = false
            };

            user.Notes.Add(note);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditNote(int id, [FromBody] NoteDto noteDto)
        {
            var user = await GetUser();
            if (user == null)
            {
                return UserNotFound();
            }

            var note = user.Notes?.FirstOrDefault(x => x.Id == id);
            if (note == null)
            {
                return NoteNotFound(id);
            }

            note.Title = noteDto.Title;
            note.Body = noteDto.Body;
            note.IsEdited = true;

            await _dbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(int id)
        {
            var user = await GetUser();
            if (user == null)
            {
                return UserNotFound();
            }

            var note = user.Notes?.FirstOrDefault(x => x.Id == id);
            if (note == null)
            {
                return NoteNotFound(id);
            }

            _dbContext.Notes.Remove(note);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }

        private async Task<User?> GetUser()
        {
            var username = GetUsername();
            return await _dbContext.Users.FirstOrDefaultAsync(x => x.Username == username);
        }

        private string GetUsername()
        {
            return User.FindFirstValue(ClaimsIdentity.DefaultNameClaimType);
        }

        private IActionResult UserNotFound()
        {
            return BadRequest($"User '{GetUsername()}' doesn't exist");
        }

        private IActionResult NoteNotFound(int id)
        {
            return BadRequest($"Note with ID '{id}' doesn't exist");
        }
    }
}
