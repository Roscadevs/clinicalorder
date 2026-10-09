---
type: community
members: 16
---

# .bookTemporaryHold

**Members:** 16 nodes

## Members
- [[dot-bookTemporaryHold()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-createDepositPreference()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/payment/MercadoPagoPaymentAdapter.java
- [[dot-expireHold()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-findById()_10]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/DermatologicServiceRepository.java
- [[dot-findById()_11]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/PatientRepository.java
- [[dot-findById()_12]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/UserRepository.java
- [[dot-findOverlappingAppointments()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[dot-findOverlappingBlocks()_2]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/CalendarBlockRepository.java
- [[dot-registerFinalPayment()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/PaymentService.java
- [[dot-resolveInitPoint()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/payment/MercadoPagoPaymentAdapter.java
- [[dot-save()_10]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[dot-testBookTemporaryHold_ExpiredOverlappingHold_IsReleased()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testBookTemporaryHold_SlotUnavailable_ThrowsException()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testBookTemporaryHold_Success()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testRegisterFinalPayment_DelegatesToStrategy_CompletesAppointment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[com.mercadopago.resources.preference.Preference]] - code

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/bookTemporaryHold
SORT file.name ASC
```

## Connections to other communities
- 10 edges to [[_COMMUNITY_AppointmentServiceTest]]
- 10 edges to [[_COMMUNITY_org.junit.jupiter.api.DisplayName]]
- 7 edges to [[_COMMUNITY_AppointmentService]]
- 7 edges to [[_COMMUNITY_org.springframework.transaction.annotation.Transactional]]
- 4 edges to [[_COMMUNITY_Appointment]]
- 4 edges to [[_COMMUNITY_dot-getAvailableSlots]]
- 4 edges to [[_COMMUNITY_dot-registerDepositPayment]]
- 4 edges to [[_COMMUNITY_MedicalRecordDTO]]
- 3 edges to [[_COMMUNITY_PaymentServiceTest.java]]
- 2 edges to [[_COMMUNITY_CalendarBlock]]
- 2 edges to [[_COMMUNITY_PaymentServiceTest]]
- 2 edges to [[_COMMUNITY_ServiceResponseDTO]]
- 2 edges to [[_COMMUNITY_Patient]]
- 2 edges to [[_COMMUNITY_AppointmentServiceTest.java]]
- 2 edges to [[_COMMUNITY_ClinicalEntryResponseDTO]]
- 2 edges to [[_COMMUNITY_org.springframework.http.ResponseEntity]]
- 1 edge to [[_COMMUNITY_GlobalExceptionHandler]]
- 1 edge to [[_COMMUNITY_User]]
- 1 edge to [[_COMMUNITY_DermatologicService]]
- 1 edge to [[_COMMUNITY_org.springframework.stereotype.Service]]
- 1 edge to [[_COMMUNITY_CalendarBlockResponseDTO]]

## Top bridge nodes
- [[dot-findById()_12]] - degree 16, connects to 7 communities
- [[dot-bookTemporaryHold()]] - degree 20, connects to 6 communities
- [[dot-registerFinalPayment()]] - degree 11, connects to 6 communities
- [[dot-testRegisterFinalPayment_DelegatesToStrategy_CompletesAppointment()]] - degree 8, connects to 5 communities
- [[dot-save()_10]] - degree 11, connects to 4 communities