---
type: community
members: 13
---

# PaymentServiceTest

**Members:** 13 nodes

## Members
- [[dot-findByMpPreferenceId()_2]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/PaymentTransactionRepository.java
- [[dot-getPaymentDetails()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/payment/MercadoPagoPaymentAdapter.java
- [[dot-isValidSignature()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/PaymentService.java
- [[dot-processMercadoPagoWebhook()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/PaymentService.java
- [[dot-testIsValidSignature_SuccessAndFailure()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testWebhook_AlreadyApproved_IsIdempotent()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testWebhook_Approved_Deposit_ConfirmsAppointment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testWebhook_Approved_Full_ConfirmsAppointment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testWebhook_InProcess_MaintainsPendingAppointment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testWebhook_QueryParams_Approved()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testWebhook_Rejected_MarksPaymentFailed()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[Appointment_5]] - code
- [[PaymentServiceTest]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/PaymentServiceTest
SORT file.name ASC
```

## Connections to other communities
- 16 edges to [[_COMMUNITY_org.junit.jupiter.api.DisplayName]]
- 6 edges to [[_COMMUNITY_AppointmentService]]
- 6 edges to [[_COMMUNITY_dot-registerDepositPayment]]
- 5 edges to [[_COMMUNITY_PaymentServiceTest.java]]
- 3 edges to [[_COMMUNITY_org.springframework.stereotype.Component]]
- 3 edges to [[_COMMUNITY_MedicalRecordServiceTest]]
- 2 edges to [[_COMMUNITY_dot-bookTemporaryHold]]
- 2 edges to [[_COMMUNITY_AppointmentServiceTest]]
- 1 edge to [[_COMMUNITY_Appointment]]
- 1 edge to [[_COMMUNITY_org.springframework.stereotype.Service]]
- 1 edge to [[_COMMUNITY_User]]
- 1 edge to [[_COMMUNITY_org.springframework.transaction.annotation.Transactional]]

## Top bridge nodes
- [[PaymentServiceTest]] - degree 30, connects to 10 communities
- [[dot-processMercadoPagoWebhook()]] - degree 17, connects to 4 communities
- [[dot-getPaymentDetails()]] - degree 9, connects to 2 communities
- [[dot-findByMpPreferenceId()_2]] - degree 9, connects to 1 community
- [[dot-testWebhook_AlreadyApproved_IsIdempotent()]] - degree 6, connects to 1 community