using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using EmployeeRegistry.API.DTOs;

namespace EmployeeRegistry.API.Reports;

public class PdfService
{
    public PdfService()
    {
        QuestPDF.Settings.License = LicenseType.Community;
    }

    // ── 1. Employee List (Table View) ─────────────────────────
    public byte[] GenerateEmployeeListPdf(IEnumerable<EmployeeDto> employees, string? searchTerm = null)
    {
        var list = employees.ToList();

        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4.Landscape());
                page.Margin(1.5f, Unit.Centimetre);
                page.DefaultTextStyle(x => x.FontSize(10).FontFamily("Arial"));

                page.Header().Column(col =>
                {
                    col.Item().Row(row =>
                    {
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Text("Employee Directory").FontSize(20).Bold().FontColor("#1a1d27");
                            c.Item().Text(searchTerm != null
                                ? $"Filtered by: \"{searchTerm}\"  ·  {list.Count} result(s)"
                                : $"All Employees  ·  {list.Count} record(s)")
                                .FontSize(10).FontColor("#8890b0");
                        });
                        row.ConstantItem(120).AlignRight().AlignBottom()
                            .Text(DateTime.Now.ToString("dd MMM yyyy"))
                            .FontSize(9).FontColor("#8890b0");
                    });
                    col.Item().PaddingTop(8).LineHorizontal(1.5f).LineColor("#6c8fff");
                    col.Item().PaddingBottom(4);
                });

                page.Content().Table(table =>
                {
                    table.ColumnsDefinition(cols =>
                    {
                        cols.ConstantColumn(30);
                        cols.RelativeColumn(3);
                        cols.RelativeColumn(2);
                        cols.RelativeColumn(2);
                        cols.RelativeColumn(2);
                        cols.RelativeColumn(1.5f);
                        cols.RelativeColumn(2);
                    });

                    // ✅ QuestPDF v2 — header requires a callback
                    table.Header(header =>
                    {
                        foreach (var h in new[] { "#", "Full Name", "NID", "Phone", "Department", "Salary (BDT)", "Family" })
                        {
                            header.Cell().Background("#6c8fff").Padding(6)
                                .Text(h).FontSize(9).Bold().FontColor("#ffffff");
                        }
                    });

                    for (int i = 0; i < list.Count; i++)
                    {
                        var emp = list[i];
                        var bg = i % 2 == 0 ? "#f8f9ff" : "#ffffff";

                        table.Cell().Background(bg).BorderBottom(0.5f).BorderColor("#dee2e6").Padding(6)
                            .Text($"{i + 1}").FontSize(9).FontColor("#8890b0");
                        table.Cell().Background(bg).BorderBottom(0.5f).BorderColor("#dee2e6").Padding(6)
                            .Text(emp.Name).FontSize(9).Bold();
                        table.Cell().Background(bg).BorderBottom(0.5f).BorderColor("#dee2e6").Padding(6)
                            .Text(emp.NID).FontSize(8).FontFamily("Courier New").FontColor("#444444");
                        table.Cell().Background(bg).BorderBottom(0.5f).BorderColor("#dee2e6").Padding(6)
                            .Text(emp.Phone).FontSize(9);
                        table.Cell().Background(bg).BorderBottom(0.5f).BorderColor("#dee2e6").Padding(6)
                            .Text(emp.Department).FontSize(9).FontColor("#6c8fff");
                        table.Cell().Background(bg).BorderBottom(0.5f).BorderColor("#dee2e6").Padding(6)
                            .Text($"৳{emp.BasicSalary:N0}").FontSize(9).Bold();

                        var family = new List<string>();
                        if (emp.Spouse != null) family.Add("Spouse");
                        if (emp.Children?.Count > 0) family.Add($"{emp.Children.Count} child(ren)");
                        table.Cell().Background(bg).BorderBottom(0.5f).BorderColor("#dee2e6").Padding(6)
                            .Text(family.Count > 0 ? string.Join(", ", family) : "—")
                            .FontSize(9).FontColor("#8890b0");
                    }
                });

                page.Footer().AlignCenter().Text(t =>
                {
                    t.Span("Employee & Family Registry  ·  Generated: ").FontSize(8).FontColor("#8890b0");
                    t.Span(DateTime.Now.ToString("dd MMM yyyy HH:mm")).FontSize(8).FontColor("#8890b0");
                    t.Span("  ·  Page ").FontSize(8).FontColor("#8890b0");
                    t.CurrentPageNumber().FontSize(8).FontColor("#8890b0");
                    t.Span(" of ").FontSize(8).FontColor("#8890b0");
                    t.TotalPages().FontSize(8).FontColor("#8890b0");
                });
            });
        }).GeneratePdf();
    }

    // ── 2. Individual Employee CV ─────────────────────────────
    public byte[] GenerateEmployeeCvPdf(EmployeeDetailsDto emp)
    {
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.DefaultTextStyle(x => x.FontSize(10).FontFamily("Arial"));

                page.Content().Column(col =>
                {
                    col.Item().Background("#6c8fff").Padding(20).Row(row =>
                    {
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Text(emp.Name).FontSize(24).Bold().FontColor("#ffffff");
                            c.Item().Text(emp.Department).FontSize(12).FontColor("#cdd5ff");
                            c.Item().PaddingTop(4).Text($"Employee ID: #{emp.Id:D4}")
                                .FontSize(9).FontColor("#a5b4fc");
                        });
                        row.ConstantItem(100).AlignRight().AlignMiddle().Column(c =>
                        {
                            c.Item().Text("EMPLOYEE CV").FontSize(8).Bold().FontColor("#a5b4fc").AlignRight();
                            c.Item().Text(DateTime.Now.ToString("dd MMM yyyy")).FontSize(8).FontColor("#a5b4fc").AlignRight();
                        });
                    });

                    col.Item().PaddingBottom(16);

                    col.Item().Text("Personal Information").FontSize(13).Bold().FontColor("#1a1d27");
                    col.Item().PaddingTop(4).LineHorizontal(1).LineColor("#6c8fff");
                    col.Item().PaddingTop(8);

                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(c => { c.RelativeColumn(); c.RelativeColumn(); });

                        table.Cell().Padding(8).Background("#f8f9ff").BorderBottom(0.5f).BorderColor("#e2e8f0").Column(c =>
                        {
                            c.Item().Text("National ID (NID)").FontSize(8).FontColor("#8890b0");
                            c.Item().Text(emp.NID).FontSize(10).Bold().FontColor("#1a1d27");
                        });
                        table.Cell().Padding(8).Background("#ffffff").BorderBottom(0.5f).BorderColor("#e2e8f0").Column(c =>
                        {
                            c.Item().Text("Phone Number").FontSize(8).FontColor("#8890b0");
                            c.Item().Text(emp.Phone).FontSize(10).Bold().FontColor("#1a1d27");
                        });
                        table.Cell().Padding(8).Background("#f8f9ff").BorderBottom(0.5f).BorderColor("#e2e8f0").Column(c =>
                        {
                            c.Item().Text("Department").FontSize(8).FontColor("#8890b0");
                            c.Item().Text(emp.Department).FontSize(10).Bold().FontColor("#1a1d27");
                        });
                        table.Cell().Padding(8).Background("#ffffff").BorderBottom(0.5f).BorderColor("#e2e8f0").Column(c =>
                        {
                            c.Item().Text("Basic Salary").FontSize(8).FontColor("#8890b0");
                            c.Item().Text($"৳{emp.BasicSalary:N0} BDT").FontSize(10).Bold().FontColor("#1a1d27");
                        });
                    });

                    col.Item().PaddingBottom(20);

                    col.Item().Text("Spouse Information").FontSize(13).Bold().FontColor("#1a1d27");
                    col.Item().PaddingTop(4).LineHorizontal(1).LineColor("#a78bfa");
                    col.Item().PaddingTop(8);

                    if (emp.Spouse != null)
                    {
                        col.Item().Table(table =>
                        {
                            table.ColumnsDefinition(c => { c.RelativeColumn(); c.RelativeColumn(); });
                            table.Cell().Padding(8).Background("#f5f0ff").BorderBottom(0.5f).BorderColor("#e9d5ff").Column(c =>
                            {
                                c.Item().Text("Spouse Name").FontSize(8).FontColor("#8890b0");
                                c.Item().Text(emp.Spouse.Name).FontSize(10).Bold().FontColor("#1a1d27");
                            });
                            table.Cell().Padding(8).Background("#f5f0ff").BorderBottom(0.5f).BorderColor("#e9d5ff").Column(c =>
                            {
                                c.Item().Text("Spouse NID").FontSize(8).FontColor("#8890b0");
                                c.Item().Text(emp.Spouse.NID).FontSize(10).FontFamily("Courier New").FontColor("#1a1d27");
                            });
                        });
                    }
                    else
                    {
                        col.Item().Background("#f8f9ff").Padding(12)
                            .Text("No spouse information recorded.").FontSize(9).Italic().FontColor("#8890b0");
                    }

                    col.Item().PaddingBottom(20);

                    col.Item().Text($"Children ({emp.Children?.Count ?? 0})").FontSize(13).Bold().FontColor("#1a1d27");
                    col.Item().PaddingTop(4).LineHorizontal(1).LineColor("#34d399");
                    col.Item().PaddingTop(8);

                    if (emp.Children != null && emp.Children.Count > 0)
                    {
                        col.Item().Table(table =>
                        {
                            table.ColumnsDefinition(c =>
                            {
                                c.ConstantColumn(30);
                                c.RelativeColumn(3);
                                c.RelativeColumn(2);
                                c.RelativeColumn(1.5f);
                            });

                            // ✅ QuestPDF v2 — header requires a callback
                            table.Header(header =>
                            {
                                foreach (var h in new[] { "#", "Name", "Date of Birth", "Age" })
                                {
                                    header.Cell().Background("#34d399").Padding(6)
                                        .Text(h).FontSize(9).Bold().FontColor("#ffffff");
                                }
                            });

                            for (int i = 0; i < emp.Children.Count; i++)
                            {
                                var child = emp.Children[i];
                                var bg = i % 2 == 0 ? "#f0fdf8" : "#ffffff";
                                var age = DateTime.Today.Year - child.DateOfBirth.Year;

                                table.Cell().Background(bg).Padding(8).BorderBottom(0.5f).BorderColor("#a7f3d0")
                                    .Text($"{i + 1}").FontSize(9).FontColor("#8890b0");
                                table.Cell().Background(bg).Padding(8).BorderBottom(0.5f).BorderColor("#a7f3d0")
                                    .Text(child.Name).FontSize(9).Bold();
                                table.Cell().Background(bg).Padding(8).BorderBottom(0.5f).BorderColor("#a7f3d0")
                                    .Text(child.DateOfBirth.ToString("dd MMM yyyy")).FontSize(9);
                                table.Cell().Background(bg).Padding(8).BorderBottom(0.5f).BorderColor("#a7f3d0")
                                    .Text($"{age} yrs").FontSize(9).FontColor("#8890b0");
                            }
                        });
                    }
                    else
                    {
                        col.Item().Background("#f8f9ff").Padding(12)
                            .Text("No children information recorded.").FontSize(9).Italic().FontColor("#8890b0");
                    }

                    col.Item().PaddingTop(30).LineHorizontal(0.5f).LineColor("#dee2e6");
                    col.Item().PaddingTop(8).Text(t =>
                    {
                        t.Span("Generated by Employee & Family Registry  ·  ").FontSize(8).FontColor("#8890b0");
                        t.Span(DateTime.Now.ToString("dd MMM yyyy HH:mm")).FontSize(8).FontColor("#8890b0");
                    });
                });
            });
        }).GeneratePdf();
    }
}