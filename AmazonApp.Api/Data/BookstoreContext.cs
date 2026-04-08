using System;
using System.Collections.Generic;
using AmazonApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AmazonApp.Api.Data;

public partial class BookstoreContext : DbContext
{
    public BookstoreContext(DbContextOptions<BookstoreContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Book> Books { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Book>(entity =>
        {
            entity.HasKey(e => e.BookId);

            entity.Property(e => e.BookId).HasColumnName("BookID");
            entity.Property(e => e.Isbn).HasColumnName("ISBN");
            entity.Property(e => e.NumberOfPages).HasColumnName("PageCount");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
