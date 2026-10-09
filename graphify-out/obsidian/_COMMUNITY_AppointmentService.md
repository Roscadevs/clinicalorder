---
type: community
members: 26
---

# AppointmentService

**Members:** 26 nodes

## Members
- [[dot-cancelAppointment()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-expireHold()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-findByAppointmentId()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/PaymentTransactionRepository.java
- [[dot-findByDateRange()_3]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[dot-findByDateRange()_4]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/CalendarBlockRepository.java
- [[dot-findById()_11]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[dot-findExpiredHolds()]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[dot-getAppointmentById()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-getAppointmentPublicStatus()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-getAvailableSlots()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-mapToDTO()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-markAsAttended()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-rejectPendingTransactions()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-releaseExpiredHolds()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-testCancelAppointment_WithApprovedMercadoPagoPayment_TriggersRefund()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testGetAppointmentPublicStatus()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testGetAvailableSlots()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testMarkAsAttended_ConfirmedToAttended()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testMarkAsAttended_NotConfirmed_Throws()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testReleaseExpiredHolds_CancelsAndRejectsPendingPayment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[Appointment_6]] - code
- [[AppointmentRepository]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[AppointmentService]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[AppointmentServiceTest]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[DermatologicService_2]] - code
- [[Patient_2]] - code

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/AppointmentService
SORT file.name ASC
```

## Connections to other communities
- 20 edges to [[_COMMUNITY_org.junit.jupiter.api.DisplayName]]
- 13 edges to [[_COMMUNITY_dot-bookTemporaryHold]]
- 8 edges to [[_COMMUNITY_lombok.extern.slf4j.Slf4j]]
- 8 edges to [[_COMMUNITY_lombok.RequiredArgsConstructor]]
- 8 edges to [[_COMMUNITY_org.springframework.transaction.annotation.Transactional]]
- 7 edges to [[_COMMUNITY_org.springframework.http.ResponseEntity]]
- 6 edges to [[_COMMUNITY_MedicalRecordService]]
- 5 edges to [[_COMMUNITY_Appointment]]
- 4 edges to [[_COMMUNITY_CalendarBlock]]
- 4 edges to [[_COMMUNITY_AppointmentStatus]]
- 3 edges to [[_COMMUNITY_AppointmentServiceTest.java]]
- 2 edges to [[_COMMUNITY_Patient]]
- 2 edges to [[_COMMUNITY_DermatologicService]]
- 2 edges to [[_COMMUNITY_UserRepository]]
- 1 edge to [[_COMMUNITY_PaymentTransaction]]
- 1 edge to [[_COMMUNITY_AppointmentRepositoryAdapter]]
- 1 edge to [[_COMMUNITY_User]]
- 1 edge to [[_COMMUNITY_dot-isExpired]]
- 1 edge to [[_COMMUNITY_CalendarBlockResponseDTO]]

## Top bridge nodes
- [[AppointmentService]] - degree 29, connects to 11 communities
- [[AppointmentServiceTest]] - degree 25, connects to 10 communities
- [[AppointmentRepository]] - degree 15, connects to 7 communities
- [[dot-getAvailableSlots()]] - degree 9, connects to 5 communities
- [[dot-findById()_11]] - degree 17, connects to 4 communities