---
type: community
members: 14
---

# .bookTemporaryHold

**Members:** 14 nodes

## Members
- [[dot-bookTemporaryHold()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-createDepositPreference()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/payment/MercadoPagoPaymentAdapter.java
- [[dot-findById()_5]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/DermatologicServiceRepository.java
- [[dot-findById()_6]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/PatientRepository.java
- [[dot-findById()_7]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/UserRepository.java
- [[dot-findOverlappingAppointments()]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[dot-findOverlappingBlocks()_2]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/CalendarBlockRepository.java
- [[dot-registerFinalPayment()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/PaymentService.java
- [[dot-resolveInitPoint()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/payment/MercadoPagoPaymentAdapter.java
- [[dot-save()_5]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[dot-testBookTemporaryHold_ExpiredOverlappingHold_IsReleased()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testBookTemporaryHold_SlotUnavailable_ThrowsException()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testBookTemporaryHold_Success()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[com.mercadopago.resources.preference.Preference]] - code

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/bookTemporaryHold
SORT file.name ASC
```

## Connections to other communities
- 15 edges to [[_COMMUNITY_org.junit.jupiter.api.DisplayName]]
- 13 edges to [[_COMMUNITY_AppointmentService]]
- 7 edges to [[_COMMUNITY_lombok.extern.slf4j.Slf4j]]
- 4 edges to [[_COMMUNITY_org.springframework.transaction.annotation.Transactional]]
- 4 edges to [[_COMMUNITY_MedicalRecordService]]
- 3 edges to [[_COMMUNITY_PatientResponseDTO]]
- 2 edges to [[_COMMUNITY_CalendarBlock]]
- 2 edges to [[_COMMUNITY_Appointment]]
- 2 edges to [[_COMMUNITY_Patient]]
- 2 edges to [[_COMMUNITY_DermatologicService]]
- 2 edges to [[_COMMUNITY_AppointmentServiceTest.java]]
- 2 edges to [[_COMMUNITY_dot-isExpired]]
- 2 edges to [[_COMMUNITY_org.springframework.http.ResponseEntity]]
- 2 edges to [[_COMMUNITY_ServiceResponseDTO]]
- 2 edges to [[_COMMUNITY_MedicalRecord]]
- 1 edge to [[_COMMUNITY_User]]
- 1 edge to [[_COMMUNITY_UserRepository]]
- 1 edge to [[_COMMUNITY_CalendarBlockResponseDTO]]

## Top bridge nodes
- [[dot-bookTemporaryHold()]] - degree 20, connects to 6 communities
- [[dot-findById()_7]] - degree 16, connects to 6 communities
- [[dot-registerFinalPayment()]] - degree 11, connects to 5 communities
- [[dot-findById()_6]] - degree 11, connects to 4 communities
- [[dot-save()_5]] - degree 11, connects to 3 communities