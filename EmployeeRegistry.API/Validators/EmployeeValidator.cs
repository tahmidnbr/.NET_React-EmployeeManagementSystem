using FluentValidation;
using EmployeeRegistry.API.DTOs;

namespace EmployeeRegistry.API.Validators;

public class EmployeeValidator : AbstractValidator<CreateEmployeeDto>
{
    public EmployeeValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(100);

        RuleFor(x => x.NID)
            .NotEmpty().WithMessage("NID is required.")
            .Matches(@"^\d{10}$|^\d{17}$")
            .WithMessage("NID must be exactly 10 or 17 digits.");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone is required.")
            .Matches(@"^(\+8801[3-9]\d{8}|01[3-9]\d{8})$")
            .WithMessage("Phone must be a valid Bangladeshi number (e.g. +8801711234567 or 01711234567).");

        RuleFor(x => x.Department)
            .NotEmpty().WithMessage("Department is required.");

        RuleFor(x => x.BasicSalary)
            .GreaterThan(0).WithMessage("Basic Salary must be greater than 0.");

        // Spouse NID validation (if provided)
        When(x => x.Spouse != null, () =>
        {
            RuleFor(x => x.Spouse!.Name).NotEmpty().WithMessage("Spouse name is required.");
            RuleFor(x => x.Spouse!.NID)
                .Matches(@"^\d{10}$|^\d{17}$")
                .WithMessage("Spouse NID must be 10 or 17 digits.");
        });

        // Children validation (if provided)
        RuleForEach(x => x.Children).ChildRules(child =>
        {
            child.RuleFor(c => c.Name).NotEmpty().WithMessage("Child name is required.");
            child.RuleFor(c => c.DateOfBirth)
                .LessThan(DateOnly.FromDateTime(DateTime.Today))
                .WithMessage("Child date of birth must be in the past.");
        });
    }
}