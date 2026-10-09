---
type: community
members: 10
---

# AppointmentStatus

**Members:** 10 nodes

## Members
- [[ATTENDED]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/model/AppointmentStatus.java
- [[AppointmentResponseDTO.java]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/dto/AppointmentResponseDTO.java
- [[AppointmentStatus]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/model/AppointmentStatus.java
- [[AppointmentStatus.java]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/model/AppointmentStatus.java
- [[CANCELED]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/model/AppointmentStatus.java
- [[COMPLETED]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/model/AppointmentStatus.java
- [[CONFIRMED]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/model/AppointmentStatus.java
- [[NO_SHOW]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/model/AppointmentStatus.java
- [[PAYMENT_FAILED]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/model/AppointmentStatus.java
- [[PENDING_PAYMENT]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/model/AppointmentStatus.java

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/AppointmentStatus
SORT file.name ASC
```

## Connections to other communities
- 2 edges to [[_COMMUNITY_AppointmentResponseDTO]]
- 2 edges to [[_COMMUNITY_Appointment]]
- 2 edges to [[_COMMUNITY_PaymentReceiptDTO]]
- 1 edge to [[_COMMUNITY_CalendarBlock]]
- 1 edge to [[_COMMUNITY_lombok.RequiredArgsConstructor]]

## Top bridge nodes
- [[AppointmentStatus]] - degree 16, connects to 5 communities
- [[AppointmentResponseDTO.java]] - degree 2, connects to 1 community