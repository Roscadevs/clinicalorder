---
type: community
members: 26
---

# AppointmentService

**Members:** 26 nodes

## Members
- [[dot-bookTemporaryHold()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-cancelAppointment()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-expireHold()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-findByDateRange()_4]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[dot-findByDateRange()_5]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/CalendarBlockRepository.java
- [[dot-findById()_12]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/DermatologicServiceRepository.java
- [[dot-findById()_13]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/PatientRepository.java
- [[dot-findExpiredHolds()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[dot-findOverlappingAppointments()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[dot-findOverlappingBlocks()_2]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/CalendarBlockRepository.java
- [[dot-getAvailableSlots()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-mapToDTO()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-rejectPendingTransactions()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-releaseExpiredHolds()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-save()_10]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[dot-testBookTemporaryHold_ExpiredOverlappingHold_IsReleased()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testBookTemporaryHold_SlotUnavailable_ThrowsException()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testBookTemporaryHold_Success()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testGetAvailableSlots()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testReleaseExpiredHolds_CancelsAndRejectsPendingPayment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[Appointment_8]] - code
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
- 14 edges to [[_COMMUNITY_Appointment]]
- 9 edges to [[_COMMUNITY_lombok.extern.slf4j.Slf4j]]
- 9 edges to [[_COMMUNITY_org.springframework.transaction.annotation.Transactional]]
- 8 edges to [[_COMMUNITY_AppointmentController]]
- 6 edges to [[_COMMUNITY_org.springframework.stereotype.Component]]
- 6 edges to [[_COMMUNITY_MedicalRecordService]]
- 5 edges to [[_COMMUNITY_AppointmentServiceTest.java]]
- 4 edges to [[_COMMUNITY_Patient]]
- 4 edges to [[_COMMUNITY_dot-findById]]
- 3 edges to [[_COMMUNITY_DermatologicServiceRepository]]
- 3 edges to [[_COMMUNITY_dot-isExpired]]
- 2 edges to [[_COMMUNITY_lombok.RequiredArgsConstructor]]
- 2 edges to [[_COMMUNITY_UserRepository]]
- 1 edge to [[_COMMUNITY_User]]
- 1 edge to [[_COMMUNITY_AesEncryptionService]]
- 1 edge to [[_COMMUNITY_DermatologicService]]
- 1 edge to [[_COMMUNITY_CalendarBlockResponseDTO]]
- 1 edge to [[_COMMUNITY_ServiceResponseDTO]]

## Top bridge nodes
- [[AppointmentService]] - degree 27, connects to 11 communities
- [[AppointmentServiceTest]] - degree 22, connects to 11 communities
- [[dot-bookTemporaryHold()]] - degree 19, connects to 7 communities
- [[AppointmentRepository]] - degree 15, connects to 4 communities
- [[dot-findById()_12]] - degree 10, connects to 4 communities