---
type: community
members: 19
---

# .bookTemporaryHold

**Members:** 19 nodes

## Members
- [[dot-HoldPolicy()]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/model/HoldPolicy.java
- [[dot-bookTemporaryHold()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-createDepositPreference()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/payment/MercadoPagoPaymentAdapter.java
- [[dot-expiresAt()]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/model/HoldPolicy.java
- [[dot-findById()_6]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/DermatologicServiceRepository.java
- [[dot-findById()_7]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/PatientRepository.java
- [[dot-findById()_8]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/UserRepository.java
- [[dot-findOverlappingAppointments()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[dot-findOverlappingBlocks()_2]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/CalendarBlockRepository.java
- [[dot-isExpired()]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/model/HoldPolicy.java
- [[dot-registerFinalPayment()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/PaymentService.java
- [[dot-resolveInitPoint()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/payment/MercadoPagoPaymentAdapter.java
- [[dot-save()_6]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[dot-testBookTemporaryHold_ExpiredOverlappingHold_IsReleased()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testBookTemporaryHold_SlotUnavailable_ThrowsException()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testBookTemporaryHold_Success()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[HoldPolicy]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/model/HoldPolicy.java
- [[HoldPolicy.java]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/model/HoldPolicy.java
- [[com.mercadopago.resources.preference.Preference]] - code

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/bookTemporaryHold
SORT file.name ASC
```

## Connections to other communities
- 16 edges to [[_COMMUNITY_AppointmentService]]
- 12 edges to [[_COMMUNITY_org.junit.jupiter.api.DisplayName]]
- 9 edges to [[_COMMUNITY_PaymentService]]
- 8 edges to [[_COMMUNITY_org.springframework.transaction.annotation.Transactional]]
- 4 edges to [[_COMMUNITY_Appointment]]
- 4 edges to [[_COMMUNITY_MedicalRecordDTO]]
- 2 edges to [[_COMMUNITY_CalendarBlock]]
- 2 edges to [[_COMMUNITY_DermatologicService]]
- 2 edges to [[_COMMUNITY_AppointmentServiceTest.java]]
- 2 edges to [[_COMMUNITY_lombok.extern.slf4j.Slf4j]]
- 2 edges to [[_COMMUNITY_org.springframework.http.ResponseEntity]]
- 1 edge to [[_COMMUNITY_PaymentServiceTest.java]]
- 1 edge to [[_COMMUNITY_Patient]]
- 1 edge to [[_COMMUNITY_User]]
- 1 edge to [[_COMMUNITY_ServiceResponseDTO]]
- 1 edge to [[_COMMUNITY_CalendarBlockResponseDTO]]
- 1 edge to [[_COMMUNITY_MedicalRecordService]]

## Top bridge nodes
- [[dot-findById()_8]] - degree 16, connects to 8 communities
- [[dot-registerFinalPayment()]] - degree 11, connects to 6 communities
- [[dot-bookTemporaryHold()]] - degree 20, connects to 5 communities
- [[dot-save()_6]] - degree 11, connects to 4 communities
- [[dot-findById()_6]] - degree 10, connects to 4 communities