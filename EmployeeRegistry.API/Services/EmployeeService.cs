using AutoMapper;
using Microsoft.EntityFrameworkCore;
using EmployeeRegistry.API.Data;
using EmployeeRegistry.API.DTOs;
using EmployeeRegistry.API.Models;

namespace EmployeeRegistry.API.Services;

public interface IEmployeeService
{
    Task<IEnumerable<EmployeeDto>> GetAllAsync(string? search);
    Task<EmployeeDetailsDto?> GetByIdAsync(int id);
    Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto);
    Task<EmployeeDto?> UpdateAsync(int id, UpdateEmployeeDto dto);
    Task<bool> DeleteAsync(int id);
}

public class EmployeeService : IEmployeeService
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public EmployeeService(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    public async Task<IEnumerable<EmployeeDto>> GetAllAsync(string? search)
    {
        var query = _db.Employees
            .Include(e => e.Spouse)
            .Include(e => e.Children)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(e =>
                e.Name.ToLower().Contains(term) ||
                e.NID.Contains(term) ||
                e.Department.ToLower().Contains(term));
        }

        var employees = await query.OrderBy(e => e.Name).ToListAsync();
        return _mapper.Map<IEnumerable<EmployeeDto>>(employees);
    }

    public async Task<EmployeeDetailsDto?> GetByIdAsync(int id)
    {
        var employee = await _db.Employees
            .Include(e => e.Spouse)
            .Include(e => e.Children)
            .FirstOrDefaultAsync(e => e.Id == id);

        return employee is null ? null : _mapper.Map<EmployeeDetailsDto>(employee);
    }

    public async Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto)
    {
        var employee = _mapper.Map<Employee>(dto);
        _db.Employees.Add(employee);
        await _db.SaveChangesAsync();
        return _mapper.Map<EmployeeDto>(employee);
    }

    public async Task<EmployeeDto?> UpdateAsync(int id, UpdateEmployeeDto dto)
    {
        var employee = await _db.Employees
            .Include(e => e.Spouse)
            .Include(e => e.Children)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (employee is null) return null;

        // Update scalar fields
        _mapper.Map(dto, employee);

        // Spouse: replace or remove
        if (dto.Spouse is not null)
        {
            if (employee.Spouse is null)
                employee.Spouse = _mapper.Map<Spouse>(dto.Spouse);
            else
            {
                employee.Spouse.Name = dto.Spouse.Name;
                employee.Spouse.NID  = dto.Spouse.NID;
            }
        }
        else
        {
            employee.Spouse = null;
        }

        // Children: load from DB first to get real IDs, then delete and replace
        var existingChildren = await _db.Children
            .Where(c => c.EmployeeId == id)
            .ToListAsync();
        _db.Children.RemoveRange(existingChildren);
        await _db.SaveChangesAsync();

        employee.Children = dto.Children?
            .Select(c => _mapper.Map<Child>(c)).ToList() ?? new List<Child>();

        await _db.SaveChangesAsync();
        return _mapper.Map<EmployeeDto>(employee);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var employee = await _db.Employees.FindAsync(id);
        if (employee is null) return false;

        _db.Employees.Remove(employee);
        await _db.SaveChangesAsync();
        return true;
    }
}