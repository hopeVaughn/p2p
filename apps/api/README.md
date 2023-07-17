# P2P Bathroom Finder

This is a backend application for a peer-to-peer bathroom finding service. Users can find bathrooms and rate them based on their experiences. The application is built with the NestJS framework and uses Prisma for database access. It follows a modular structure, with each module serving a unique feature set.

## Table of Contents

1. [Modules](#modules)
    - [App Module](#app-module)
    - [Auth Module](#auth-module)
    - [Bathroom Module](#bathroom-module)
    - [Prisma Module](#prisma-module)
    - [Rating Module](#rating-module)
    - [Report Module](#report-module)
    - [Role Module](#role-module)
    - [User Module](#user-module)
    - [UserReport Module](#userreport-module)
    - [UserRole Module](#userrole-module)
    - [Verify Module](#verify-module)
2. [Installation & Running](#installation--running)
3. [Running Tests](#running-tests)

## Modules

### App Module

The `app.module.ts` is the root module of the application. All other modules are imported here. It sets up the NestJS application and initializes other modules such as the `AuthModule`, `UserModule`, `BathroomModule`, `RatingModule`, `ReportModule`, `RoleModule`, `UserRoleModule`, `UserReportModule`, `VerifyModule`, and `PrismaModule`.

### Auth Module

The `auth` module handles authentication-related operations. It provides signup and signin functionalities, uses Argon2 for password hashing and verification, and JSON Web Tokens (JWT) for maintaining user sessions. The `auth` module is imported in the `app.module.ts`.

### Bathroom Module

The `bathroom` module handles all the operations related to bathrooms. It allows authenticated users to create, retrieve, update, and delete bathrooms. It interacts with the `UserModule` and `RatingModule` for user authentication and bathroom rating respectively. The module takes precautions in the controller to ensure that only authenticated users can create, update, or delete bathrooms. In the service, it ensures that a user cannot delete a bathroom if they are not the creator of the bathroom.

### Prisma Module

The `prisma` module provides the Prisma service, which is responsible for database access. It is used by all other modules that need to interact with the database. The Prisma service is created with configurations for the specific database URL which can be provided in the environment variables. It also provides a method to clean the database which can be useful for testing.

### Rating Module

The `rating` module allows users to create or update ratings for bathrooms. It calculates the average rating for each bathroom. It interacts with the `UserModule` and `BathroomModule` for user authentication and bathroom details respectively. In the service of this module, it is taken care of that a user cannot rate a bathroom more than once. In case a user tries to rate a bathroom more than once, the existing rating is updated instead of creating a new rating.

### Report Module

The `report` module handles the creation of reports by users. A report is created when a user reports a bathroom. The user needs to be authenticated and provide a reason for the report.

### Role Module

The `role` module is responsible for managing user roles. The roles determine the permissions a user has within the application.

### User Module

The `user` module handles operations related to user management. It provides functionalities to fetch user details.

### UserReport Module

The `user-report` module handles the reports made by users. It allows users to create, retrieve, update, and delete reports. The `UserReportService` interacts with the `PrismaService` to perform database operations.

### UserRole Module

The `user-role` module manages the assignment of roles to users. It allows to set, update, and delete roles of a user.

### Verify Module

The `verify` module handles the verification of bathrooms. A user can verify a bathroom if they have used it. The `VerifyService` interacts with the `PrismaService` to perform database operations.

## Installation & Running

TBD....

## Running Tests

TBD....
