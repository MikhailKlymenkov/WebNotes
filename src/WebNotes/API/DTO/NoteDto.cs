using System.ComponentModel.DataAnnotations;

namespace API.DTO;

public class NoteDto
{
    [Required]
    [StringLength(50)]
    public string Title { get; set; }

    public string Body { get; set; }
}