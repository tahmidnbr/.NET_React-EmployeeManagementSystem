using EmployeeRegistry.API.Models;

namespace EmployeeRegistry.API.Data;

public static class SeedData
{
    public static void Initialize(AppDbContext context)
    {
        if (context.Employees.Any()) return; // Already seeded

        var employees = new List<Employee>
        {
            new() {
                Name = "Md. Hasan Ali", NID = "1234567890", Phone = "+8801711000001",
                Department = "Engineering", BasicSalary = 55000,
                Spouse = new Spouse { Name = "Fatema Begum", NID = "9876543210" },
                Children = new List<Child> {
                    new() { Name = "Rafi Hasan", DateOfBirth = new DateOnly(2015, 3, 12) }
                }
            },
            new() {
                Name = "Tanvir Ahmed", NID = "2345678901", Phone = "01812000002",
                Department = "HR", BasicSalary = 42000,
                Spouse = new Spouse { Name = "Nasrin Akter", NID = "8765432109" },
                Children = new List<Child> {
                    new() { Name = "Tanha Ahmed", DateOfBirth = new DateOnly(2018, 7, 22) },
                    new() { Name = "Tarek Ahmed", DateOfBirth = new DateOnly(2020, 1, 5) }
                }
            },
            new() {
                Name = "Moushumi Khanam", NID = "3456789012", Phone = "+8801911000003",
                Department = "Finance", BasicSalary = 48000
            },
            new() {
                Name = "Rafiqul Islam", NID = "4567890123", Phone = "01611000004",
                Department = "Engineering", BasicSalary = 60000,
                Spouse = new Spouse { Name = "Shahnaz Parvin", NID = "7654321098" }
            },
            new() {
                Name = "Sumaiya Akter", NID = "5678901234", Phone = "+8801511000005",
                Department = "Marketing", BasicSalary = 38000,
                Children = new List<Child> {
                    new() { Name = "Safwan Hossain", DateOfBirth = new DateOnly(2017, 11, 30) }
                }
            },
            new() {
                Name = "Karim Uddin", NID = "67890123456789012", Phone = "01711000006",
                Department = "Operations", BasicSalary = 35000,
                Spouse = new Spouse { Name = "Rahela Begum", NID = "6543210987" }
            },
            new() {
                Name = "Nusrat Jahan", NID = "7890123456", Phone = "+8801811000007",
                Department = "IT", BasicSalary = 52000
            },
            new() {
                Name = "Shakil Hossain", NID = "89012345678901234", Phone = "01912000008",
                Department = "Engineering", BasicSalary = 65000,
                Spouse = new Spouse { Name = "Mitu Begum", NID = "5432109876" },
                Children = new List<Child> {
                    new() { Name = "Shahriar Shakil", DateOfBirth = new DateOnly(2016, 5, 18) },
                    new() { Name = "Shanaz Shakil",   DateOfBirth = new DateOnly(2019, 9, 2)  }
                }
            },
            new() {
                Name = "Fariha Islam", NID = "9012345678", Phone = "+8801611000009",
                Department = "HR", BasicSalary = 40000
            },
            new() {
                Name = "Mizanur Rahman", NID = "0123456789", Phone = "01511000010",
                Department = "Finance", BasicSalary = 70000,
                Spouse = new Spouse { Name = "Dilruba Yeasmin", NID = "4321098765" },
                Children = new List<Child> {
                    new() { Name = "Maisha Rahman", DateOfBirth = new DateOnly(2014, 2, 14) }
                }
            },
        };

        context.Employees.AddRange(employees);
        context.SaveChanges();
    }
}