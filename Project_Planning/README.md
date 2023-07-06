# This readme will serve as the white board used for explaining the different aspects of the application and the thought process behind each design decision

## Data Base Relations

### In Defense of the Prisma Schema

Firstly, let's acknowledge that every architecture has its trade-offs, and this schema is no exception. However, the design decisions made in this Prisma schema reflect a balance of maintainability, flexibility, and normalization that aligns with both the business requirements and best practices for PostgreSQL databases.

Here are some key considerations:

1. Role-Based Access Control (RBAC): The Role and UserRole models play a key role in managing user permissions. This separation allows for flexible assignment and management of roles. A single user can have multiple roles and a role can be assigned to multiple users, making the system robust and adaptable to changes.

2. Normalizing User-Bathroom interactions: The Bathroom, Verification, Rating, Report, and UserReport models encapsulate different interactions users have with bathrooms. By separating these concerns, the schema not only follows normalization rules, but also improves maintainability. For instance, if we need to add fields to the Rating model, we can do this without affecting the Bathroom or User model.

3. Tracking changes over time: Every model has createdAt and updatedAt timestamps. These fields are valuable for audit trails and debugging.

4. Declarative and strongly-typed schema: The usage of enums (e.g., RoleName, BathroomGender, StallType) increases data integrity and readability. Using uuid() for IDs ensures uniqueness across large datasets.

5. Indexed querying: The composite index on the Bathroom's latitude and longitude fields optimizes geo-spatial queries.

6. Data validation and integrity: The relationships between models are clearly defined, allowing Prisma to enforce referential integrity. Also, by marking fields like email in User model as @unique, we can prevent duplicate data entry at the database level.

7. Security: Passwords are stored in the User model, but it’s important to note that these should be hashed before storage, which can be handled in application business logic.

While some may argue that the schema is complex due to its many tables and relationships, it's worth noting that this structure allows for greater extensibility, maintainability, and scalability. As the application grows, this flexibility will prove crucial for the longevity of the application.

### Below is the relationships between the entities in the database

### User

- User to Bathroom: One to Many (createdBathrooms)
- User to UserRole: One to Many
- User to Verification: One to Many (bathroomVerifications)
- User to Rating: One to Many (ratedRatings)
- User to Report: One to Many (reportedReports)
- User to UserReport: One to Many (userReports)

### Bathroom

- Bathroom to User: Many to One (createdBy)
- Bathroom to User: Many to One (verifiedByUser)
- Bathroom to Rating: One to Many
- Bathroom to Report: One to Many
- Bathroom to Verification: One to Many

### Verification

- Verification to User: Many to One (verifiedBy)
- Verification to Bathroom: Many to One (bathroom)

### Rating

- Rating to User: Many to One (ratedBy)
- Rating to Bathroom: Many to One (bathroom)

### Report

- Report to User: Many to One (reportedBy)
- Report to Bathroom: Many to One (bathroom)
- Report to UserReport: One to Many

### UserRole

- UserRole to User: Many to One (user)
- UserRole to Role: Many to One (role)

### UserReport

- UserReport to User: Many to One (user)
- UserReport to Report: Many to One (report)

## Potential Back end Folder Structure

```plaintext
src
├── app.module.ts
├── main.ts
├── bathroom
│   ├── dto
│   │   └── create-bathroom.dto.ts
│   ├── bathroom.module.ts
│   ├── bathroom.service.ts
│   └── bathroom.controller.ts
├── user
│   ├── dto
│   │   └── create-user.dto.ts
│   ├── user.module.ts
│   ├── user.service.ts
│   └── user.controller.ts
├── rating
│   ├── dto
│   │   └── create-rating.dto.ts
│   ├── rating.module.ts
│   ├── rating.service.ts
│   └── rating.controller.ts
├── report
│   ├── dto
│   │   └── create-report.dto.ts
│   ├── report.module.ts
│   ├── report.service.ts
│   └── report.controller.ts
├── role
│   ├── dto
│   │   └── create-role.dto.ts
│   ├── role.module.ts
│   ├── role.service.ts
│   └── role.controller.ts
├── userRole
│   ├── dto
│   │   └── create-userRole.dto.ts
│   ├── userRole.module.ts
│   ├── userRole.service.ts
│   └── userRole.controller.ts
└── userReport
    ├── dto
    │   └── create-userReport.dto.ts
    ├── userReport.module.ts
    ├── userReport.service.ts
    └── userReport.controller.ts
```
