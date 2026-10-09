---
type: community
members: 16
---

# Appointment

**Members:** 16 nodes

## Members
- [[dot-findByDateRange()_2]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/jpa/JpaAppointmentRepository.java
- [[dot-findByPatientId()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[dot-findByPatientIdOrderByStartTimeDesc()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/jpa/JpaAppointmentRepository.java
- [[dot-findByStatusAndCreatedAtBefore()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/jpa/JpaAppointmentRepository.java
- [[dot-findOverlappingActiveAppointments()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/jpa/JpaAppointmentRepository.java
- [[AllArgsConstructor_9]] - code
- [[Appointment]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/model/Appointment.java
- [[Appointment.java]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/model/Appointment.java
- [[AppointmentRepository.java]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[Builder_8]] - code
- [[Entity_3]] - code
- [[Getter_9]] - code
- [[JpaAppointmentRepository]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/jpa/JpaAppointmentRepository.java
- [[NoArgsConstructor_9]] - code
- [[Setter_9]] - code
- [[Table_3]] - code

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Appointment
SORT file.name ASC
```

## Connections to other communities
- 11 edges to [[_COMMUNITY_AppointmentRepositoryAdapter]]
- 6 edges to [[_COMMUNITY_org.springframework.data.jpa.repository.JpaRepository]]
- 5 edges to [[_COMMUNITY_AppointmentService]]
- 2 edges to [[_COMMUNITY_AppointmentStatus]]
- 2 edges to [[_COMMUNITY_dot-bookTemporaryHold]]
- 2 edges to [[_COMMUNITY_lombok.RequiredArgsConstructor]]
- 2 edges to [[_COMMUNITY_dot-isExpired]]
- 1 edge to [[_COMMUNITY_PaymentTransaction]]
- 1 edge to [[_COMMUNITY_Patient]]
- 1 edge to [[_COMMUNITY_DermatologicService]]
- 1 edge to [[_COMMUNITY_User]]
- 1 edge to [[_COMMUNITY_ClinicalEntry]]

## Top bridge nodes
- [[Appointment]] - degree 36, connects to 12 communities
- [[JpaAppointmentRepository]] - degree 10, connects to 3 communities
- [[dot-findByDateRange()_2]] - degree 4, connects to 2 communities
- [[dot-findByStatusAndCreatedAtBefore()]] - degree 4, connects to 2 communities
- [[dot-findOverlappingActiveAppointments()]] - degree 4, connects to 2 communities