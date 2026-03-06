using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EmployeeRegistry.API.DTOs;
using EmployeeRegistry.API.Services;
using EmployeeRegistry.API.Reports;

namespace EmployeeRegistry.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]  // All endpoints require login
public class EmployeesController : ControllerBase
{
    private readonly IEmployeeService _service;
    private readonly PdfService _pdf;

    public EmployeesController(IEmployeeService service, PdfService pdf)
    {
        _service = service;
        _pdf = pdf;
    }

    // ── Viewer + Admin ────────────────────────────────────────

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search)
    {
        var result = await _service.GetAllAsync(search);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet("pdf")]
    public async Task<IActionResult> GetEmployeeListPdf([FromQuery] string? search)
    {
        var employees = await _service.GetAllAsync(search);
        var bytes = _pdf.GenerateEmployeeListPdf(employees, search);
        return File(bytes, "application/pdf", "Employee_List.pdf");
    }

    [HttpGet("{id:int}/pdf")]
    public async Task<IActionResult> GetEmployeeCvPdf(int id)
    {
        var employee = await _service.GetByIdAsync(id);
        if (employee is null) return NotFound();
        var bytes = _pdf.GenerateEmployeeCvPdf(employee);
        return File(bytes, "application/pdf", $"Employee_CV_{id}.pdf");
    }

    // ── Admin only ────────────────────────────────────────────

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateEmployeeDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateEmployeeDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}