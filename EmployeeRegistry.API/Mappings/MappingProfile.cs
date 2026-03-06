using AutoMapper;
using EmployeeRegistry.API.DTOs;
using EmployeeRegistry.API.Models;

namespace EmployeeRegistry.API.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Employee, EmployeeDto>();
        CreateMap<Employee, EmployeeDetailsDto>();
        CreateMap<Spouse,   SpouseDto>().ReverseMap();
        CreateMap<Child,    ChildDto>().ReverseMap();

        CreateMap<CreateEmployeeDto, Employee>();
        CreateMap<UpdateEmployeeDto, Employee>();
    }
}