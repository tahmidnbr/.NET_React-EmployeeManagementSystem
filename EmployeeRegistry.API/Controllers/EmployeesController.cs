using Microsoft.AspNetCore.Mvc;
using EmployeeRegistry.API.DTOs;
using EmployeeRegistry.API.Services;
using EmployeeRegistry.API.Reports;

namespace EmployeeRegistry.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly IEmployeeService _service;
    private readonly PdfService _pdf;

    public EmployeesController(IEmployeeService service, PdfService pdf)
    {
        _service = service;
        _pdf = pdf;
    }

    // GET /api/employees?search=hasan
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search)
    {
        var result = await _service.GetAllAsync(search);
        return Ok(result);
    }

    // GET /api/employees/5
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    // POST /api/employees
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateEmployeeDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // PUT /api/employees/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateEmployeeDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    // DELETE /api/employees/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    // GET /api/employees/5/pdf  →  individual CV
    [HttpGet("{id:int}/pdf")]
    public async Task<IActionResult> GetEmployeeCvPdf(int id)
    {
        var employee = await _service.GetByIdAsync(id);
        if (employee is null) return NotFound();

        var bytes = _pdf.GenerateEmployeeCvPdf(employee);
        return File(bytes, "application/pdf", $"Employee_CV_{id}.pdf");
    }

    // GET /api/employees/pdf?search=hasan  →  filtered list PDF
    [HttpGet("pdf")]
    public async Task<IActionResult> GetEmployeeListPdf([FromQuery] string? search)
    {
        var employees = await _service.GetAllAsync(search);
        var bytes = _pdf.GenerateEmployeeListPdf(employees, search);
        return File(bytes, "application/pdf", "Employee_List.pdf");
    }
}