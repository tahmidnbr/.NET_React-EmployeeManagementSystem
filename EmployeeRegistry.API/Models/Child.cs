namespace EmployeeRegistry.API.Models;

public class Child
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateOnly DateOfBirth { get; set; }

    // FK → Employee (One-to-Many)
    public int EmployeeId { get; set; }
    public Employee Employee { get; set; } = null!;
}