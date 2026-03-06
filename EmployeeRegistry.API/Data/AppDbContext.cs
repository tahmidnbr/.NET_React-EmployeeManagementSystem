using Microsoft.EntityFrameworkCore;
using EmployeeRegistry.API.Models;

namespace EmployeeRegistry.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<Spouse>   Spouses   => Set<Spouse>();
    public DbSet<Child>    Children  => Set<Child>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Employee → Spouse  (One-to-One)
        modelBuilder.Entity<Employee>()
            .HasOne(e => e.Spouse)
            .WithOne(s => s.Employee)
            .HasForeignKey<Spouse>(s => s.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);

        // Employee → Children  (One-to-Many)
        modelBuilder.Entity<Employee>()
            .HasMany(e => e.Children)
            .WithOne(c => c.Employee)
            .HasForeignKey(c => c.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);

        // NID must be unique across employees
        modelBuilder.Entity<Employee>()
            .HasIndex(e => e.NID)
            .IsUnique();

        // Salary precision
        modelBuilder.Entity<Employee>()
            .Property(e => e.BasicSalary)
            .HasColumnType("decimal(18,2)");
    }
}