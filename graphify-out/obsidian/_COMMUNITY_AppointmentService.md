---
type: community
members: 36
---

# AppointmentService

**Members:** 36 nodes

## Members
- [[dot-bookTemporaryHold()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-cancelAppointment()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-createDepositPreference()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/payment/MercadoPagoPaymentAdapter.java
- [[dot-expireHold()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-findByAppointmentId()_2]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/PaymentTransactionRepository.java
- [[dot-findByDateRange()_4]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[dot-findByDateRange()_5]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/CalendarBlockRepository.java
- [[dot-findById()_12]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/DermatologicServiceRepository.java
- [[dot-findById()_13]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/PatientRepository.java
- [[dot-findById()_14]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/UserRepository.java
- [[dot-findExpiredHolds()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[dot-findOverlappingAppointments()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[dot-findOverlappingBlocks()_2]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/CalendarBlockRepository.java
- [[dot-getAvailableSlots()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-mapToDTO()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-rejectPendingTransactions()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-rejectPendingTransactions()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/PaymentService.java
- [[dot-releaseExpiredHolds()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-resolveInitPoint()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/payment/MercadoPagoPaymentAdapter.java
- [[dot-save()_10]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[dot-save()_11]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/PaymentTransactionRepository.java
- [[dot-testBookTemporaryHold_ExpiredOverlappingHold_IsReleased()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testBookTemporaryHold_SlotUnavailable_ThrowsException()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testBookTemporaryHold_Success()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testCancelAppointment_WithApprovedMercadoPagoPayment_TriggersRefund()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testGetAvailableSlots()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testReleaseExpiredHolds_CancelsAndRejectsPendingPayment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[Appointment_7]] - code
- [[Appointment_8]] - code
- [[AppointmentController.java]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/controller/AppointmentController.java
- [[AppointmentRepository]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[AppointmentService]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[AppointmentServiceTest]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[DermatologicService_2]] - code
- [[Patient_2]] - code
- [[com.mercadopago.resources.preference.Preference]] - code

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/AppointmentService
SORT file.name ASC
```

## Connections to other communities
- 33 edges to [[_COMMUNITY_org.junit.jupiter.api.DisplayName]]
- 25 edges to [[_COMMUNITY_lombok.RequiredArgsConstructor]]
- 12 edges to [[_COMMUNITY_org.springframework.transaction.annotation.Transactional]]
- 8 edges to [[_COMMUNITY_org.springframework.http.ResponseEntity]]
- 7 edges to [[_COMMUNITY_Appointment]]
- 7 edges to [[_COMMUNITY_UserRepository]]
- 6 edges to [[_COMMUNITY_PaymentTransaction]]
- 4 edges to [[_COMMUNITY_PatientRepository]]
- 4 edges to [[_COMMUNITY_DermatologicServiceRepository]]
- 4 edges to [[_COMMUNITY_MedicalRecordController]]
- 3 edges to [[_COMMUNITY_MedicalRecordService]]
- 3 edges to [[_COMMUNITY_AppointmentResponseDTO]]
- 3 edges to [[_COMMUNITY_dot-isExpired]]
- 2 edges to [[_COMMUNITY_CalendarBlock]]
- 2 edges to [[_COMMUNITY_MedicalRecordServiceTest]]
- 2 edges to [[_COMMUNITY_User]]
- 1 edge to [[_COMMUNITY_PaymentPreferenceResponseDTO]]
- 1 edge to [[_COMMUNITY_TimeSlotDTO]]
- 1 edge to [[_COMMUNITY_Patient]]
- 1 edge to [[_COMMUNITY_BookAppointmentRequestDTO]]
- 1 edge to [[_COMMUNITY_DermatologicService]]
- 1 edge to [[_COMMUNITY_ResourceNotFoundException]]
- 1 edge to [[_COMMUNITY_ServiceResponseDTO]]
- 1 edge to [[_COMMUNITY_PatientResponseDTO]]
- 1 edge to [[_COMMUNITY_CalendarBlockResponseDTO]]

## Top bridge nodes
- [[AppointmentService]] - degree 29, connects to 8 communities
- [[AppointmentServiceTest]] - degree 25, connects to 8 communities
- [[dot-findById()_14]] - degree 16, connects to 7 communities
- [[dot-bookTemporaryHold()]] - degree 20, connects to 5 communities
- [[AppointmentRepository]] - degree 15, connects to 5 communities