using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace API.Model;

public class User
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public string Username { get; set; }

    public string Password { get; set; }

    public string Role { get; set; }

    public ICollection<Note> Notes { get; set; }
}