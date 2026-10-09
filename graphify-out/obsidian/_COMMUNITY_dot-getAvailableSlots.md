---
type: community
members: 9
---

# .getAvailableSlots

**Members:** 9 nodes

## Members
- [[dot-HoldPolicy()]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/model/HoldPolicy.java
- [[dot-expiresAt()]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/model/HoldPolicy.java
- [[dot-findByDateRange()_4]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[dot-findByDateRange()_5]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/CalendarBlockRepository.java
- [[dot-getAvailableSlots()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-isExpired()]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/model/HoldPolicy.java
- [[dot-testGetAvailableSlots()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[HoldPolicy]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/model/HoldPolicy.java
- [[HoldPolicy.java]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/model/HoldPolicy.java

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/getAvailableSlots
SORT file.name ASC
```

## Connections to other communities
- 4 edges to [[_COMMUNITY_Appointment]]
- 4 edges to [[_COMMUNITY_dot-bookTemporaryHold]]
- 2 edges to [[_COMMUNITY_CalendarBlock]]
- 2 edges to [[_COMMUNITY_AppointmentService]]
- 2 edges to [[_COMMUNITY_org.junit.jupiter.api.DisplayName]]
- 1 edge to [[_COMMUNITY_AppointmentServiceTest]]
- 1 edge to [[_COMMUNITY_AppointmentServiceTest.java]]
- 1 edge to [[_COMMUNITY_CalendarBlockResponseDTO]]
- 1 edge to [[_COMMUNITY_org.springframework.http.ResponseEntity]]
- 1 edge to [[_COMMUNITY_org.springframework.transaction.annotation.Transactional]]
- 1 edge to [[_COMMUNITY_dot-registerDepositPayment]]

## Top bridge nodes
- [[dot-getAvailableSlots()_1]] - degree 9, connects to 5 communities
- [[dot-testGetAvailableSlots()]] - degree 7, connects to 3 communities
- [[dot-isExpired()]] - degree 6, connects to 3 communities
- [[dot-findByDateRange()_4]] - degree 5, connects to 2 communities
- [[dot-findByDateRange()_5]] - degree 5, connects to 2 communities