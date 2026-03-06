namespace EmployeeRegistry.API.DTOs;

// ── Request DTOs ──────────────────────────────────────────────

public class CreateEmployeeDto
{
    public string Name       { get; set; } = string.Empty;
    public string NID        { get; set; } = string.Empty;
    public string Phone      { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public decimal BasicSalary { get; set; }

    public SpouseDto?       Spouse   { get; set; }
    public List<ChildDto>?  Children { get; set; }
}

public class UpdateEmployeeDto : CreateEmployeeDto { }

public class SpouseDto
{
    public string Name { get; set; } = string.Empty;
    public string NID  { get; set; } = string.Empty;
}

public class ChildDto
{
    public string   Name        { get; set; } = string.Empty;
    public DateOnly DateOfBirth { get; set; }
}

// ── Response DTOs ─────────────────────────────────────────────

public class EmployeeDto
{
    public int     Id          { get; set; }
    public string  Name        { get; set; } = string.Empty;
    public string  NID         { get; set; } = string.Empty;
    public string  Phone       { get; set; } = string.Empty;
    public string  Department  { get; set; } = string.Empty;
    public decimal BasicSalary { get; set; }
    public DateTime CreatedAt  { get; set; }

    public SpouseDto?      Spouse   { get; set; }
    public List<ChildDto>? Children { get; set; }
}

public class EmployeeDetailsDto : EmployeeDto { }