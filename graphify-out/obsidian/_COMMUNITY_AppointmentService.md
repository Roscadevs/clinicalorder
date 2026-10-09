---
type: community
members: 29
---

# AppointmentService

**Members:** 29 nodes

## Members
- [[dot-addClinicalEntry()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/MedicalRecordService.java
- [[dot-cancelAppointment()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-expireHold()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-findByAppointmentId()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/PaymentTransactionRepository.java
- [[dot-findByDateRange()_4]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[dot-findByDateRange()_5]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/CalendarBlockRepository.java
- [[dot-findById()_12]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[dot-findExpiredHolds()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[dot-getAppointmentPublicStatus()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-getAppointmentsByRange()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-getAvailableSlots()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-mapToDTO()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-markAsAttended()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-rejectPendingTransactions()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-releaseExpiredHolds()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-save()_11]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/ClinicalEntryRepository.java
- [[dot-testAddClinicalEntry_EncryptsContent()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/MedicalRecordServiceTest.java
- [[dot-testCancelAppointment_WithApprovedMercadoPagoPayment_TriggersRefund()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testGetAppointmentPublicStatus()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testGetAvailableSlots()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testMarkAsAttended_ConfirmedToAttended()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testMarkAsAttended_NotConfirmed_Throws()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testReleaseExpiredHolds_CancelsAndRejectsPendingPayment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[Appointment_7]] - code
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
- 16 edges to [[_COMMUNITY_dot-bookTemporaryHold]]
- 11 edges to [[_COMMUNITY_org.springframework.http.ResponseEntity]]
- 10 edges to [[_COMMUNITY_MedicalRecordService]]
- 9 edges to [[_COMMUNITY_org.springframework.transaction.annotation.Transactional]]
- 8 edges to [[_COMMUNITY_PaymentService]]
- 7 edges to [[_COMMUNITY_Appointment]]
- 7 edges to [[_COMMUNITY_lombok.RequiredArgsConstructor]]
- 5 edges to [[_COMMUNITY_lombok.extern.slf4j.Slf4j]]
- 4 edges to [[_COMMUNITY_CalendarBlock]]
- 3 edges to [[_COMMUNITY_AppointmentServiceTest.java]]
- 3 edges to [[_COMMUNITY_AesEncryptionService]]
- 2 edges to [[_COMMUNITY_AlergiaRequestDTO]]
- 2 edges to [[_COMMUNITY_DermatologicService]]
- 1 edge to [[_COMMUNITY_PaymentTransaction]]
- 1 edge to [[_COMMUNITY_MedicalRecordController]]
- 1 edge to [[_COMMUNITY_User]]
- 1 edge to [[_COMMUNITY_ClinicalEntry]]
- 1 edge to [[_COMMUNITY_CalendarBlockResponseDTO]]

## Top bridge nodes
- [[AppointmentServiceTest]] - degree 25, connects to 11 communities
- [[AppointmentService]] - degree 29, connects to 9 communities
- [[dot-findById()_12]] - degree 17, connects to 5 communities
- [[AppointmentRepository]] - degree 15, connects to 5 communities
- [[dot-addClinicalEntry()_1]] - degree 11, connects to 5 communities