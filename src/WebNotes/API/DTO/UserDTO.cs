using System.ComponentModel.DataAnnotations;

namespace API.DTO;

public class UserDTO
{
    [Required(AllowEmptyStrings = false)]
    [StringLength(30, MinimumLength = 4)]
    public string Username { get; set; }

    [Required(AllowEmptyStrings = false)]
    [StringLength(30, MinimumLength = 4)]
    public string Password { get; set; }
}