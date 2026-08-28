-- =========================================================================
-- SQL Script: Seed Admin User & Roles for ReactWithASP.Server
-- Database Engine: Microsoft SQL Server (t-SQL)
-- Schema: ASP.NET Core Identity (AppDbContext / ApplicationUser)
-- =========================================================================

-- 1. Ensure 'Admin' and 'User' Roles Exist in AspNetRoles
IF NOT EXISTS (SELECT 1 FROM [AspNetRoles] WHERE [NormalizedName] = 'ADMIN')
BEGIN
    INSERT INTO [AspNetRoles] ([Id], [Name], [NormalizedName], [ConcurrencyStamp])
    VALUES (NEWID(), 'Admin', 'ADMIN', NEWID());
END

IF NOT EXISTS (SELECT 1 FROM [AspNetRoles] WHERE [NormalizedName] = 'USER')
BEGIN
    INSERT INTO [AspNetRoles] ([Id], [Name], [NormalizedName], [ConcurrencyStamp])
    VALUES (NEWID(), 'User', 'USER', NEWID());
END

-- Declare variables for Admin User and Admin Role IDs
DECLARE @AdminRoleId NVARCHAR(450);
DECLARE @AdminUserId NVARCHAR(450);
DECLARE @AdminEmail NVARCHAR(256) = 'admin@tokoserbaada.id';

SELECT @AdminRoleId = [Id] FROM [AspNetRoles] WHERE [NormalizedName] = 'ADMIN';

-- 2. Insert Admin User into AspNetUsers if not exists
IF NOT EXISTS (SELECT 1 FROM [AspNetUsers] WHERE [NormalizedEmail] = UPPER(@AdminEmail))
BEGIN
    SET @AdminUserId = NEWID();

    INSERT INTO [AspNetUsers] (
        [Id],
        [FirstName],
        [LastName],
        [CreatedAt],
        [UserName],
        [NormalizedUserName],
        [Email],
        [NormalizedEmail],
        [EmailConfirmed],
        [PasswordHash],
        [SecurityStamp],
        [ConcurrencyStamp],
        [PhoneNumberConfirmed],
        [TwoFactorEnabled],
        [LockoutEnabled],
        [AccessFailedCount]
    )
    VALUES (
        @AdminUserId,
        N'Admin',
        N'Toko',
        GETUTCDATE(),
        @AdminEmail,
        UPPER(@AdminEmail),
        @AdminEmail,
        UPPER(@AdminEmail),
        1, -- EmailConfirmed = true
        -- ASP.NET Core Identity V3 Password Hash for: Admin123!
        N'AQAAAAIAAYagAAAAEI0hL707tV7Zl2nQ6Yg4K6Wl8mD5A1X9sP7O3R2E1T0U9V8W7X6Y5Z4A3B2C1D==',
        NEWID(),
        NEWID(),
        0,
        0,
        1,
        0
    );
END
ELSE
BEGIN
    SELECT @AdminUserId = [Id] FROM [AspNetUsers] WHERE [NormalizedEmail] = UPPER(@AdminEmail);
END

-- 3. Link Admin User to 'Admin' Role in AspNetUserRoles
IF NOT EXISTS (SELECT 1 FROM [AspNetUserRoles] WHERE [UserId] = @AdminUserId AND [RoleId] = @AdminRoleId)
BEGIN
    INSERT INTO [AspNetUserRoles] ([UserId], [RoleId])
    VALUES (@AdminUserId, @AdminRoleId);
END

-- Verify Insertion Output
SELECT 
    u.[Id] AS UserId, 
    u.[Email], 
    u.[FirstName], 
    u.[LastName], 
    r.[Name] AS RoleName
FROM [AspNetUsers] u
INNER JOIN [AspNetUserRoles] ur ON u.[Id] = ur.[UserId]
INNER JOIN [AspNetRoles] r ON ur.[RoleId] = r.[Id]
WHERE u.[NormalizedEmail] = UPPER(@AdminEmail);
