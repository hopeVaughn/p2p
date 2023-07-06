# This readme will serve as the white board used for explaining the different aspects of the application and the thought process behind each design decision

## Data Base Relations

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
