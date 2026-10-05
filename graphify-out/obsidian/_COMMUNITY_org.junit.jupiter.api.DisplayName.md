---
type: community
members: 30
---

# org.junit.jupiter.api.DisplayName

**Members:** 30 nodes

## Members
- [[dot-cash()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-findById()_8]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[dot-findByMpPreferenceId()_2]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/PaymentTransactionRepository.java
- [[dot-getPaymentDetails()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/payment/MercadoPagoPaymentAdapter.java
- [[dot-getStrategy()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/strategy/PaymentStrategyFactory.java
- [[dot-isValidSignature()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/PaymentService.java
- [[dot-markAsAttended()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-prepareHold()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-processMercadoPagoWebhook()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/PaymentService.java
- [[dot-registerDepositPayment()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/PaymentService.java
- [[dot-registerFinalPayment()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/PaymentService.java
- [[dot-testMarkAsAttended_ConfirmedToAttended()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testMarkAsAttended_NotConfirmed_Throws()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testRegisterDeposit_AmountBelowDeposit_Throws()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testRegisterDeposit_Cash_ConfirmsAppointment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testRegisterDeposit_ExpiredHold_CancelsAppointment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testRegisterDeposit_MercadoPago_Throws()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testRegisterFinalPayment_DelegatesToStrategy_CompletesAppointment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testRegisterFinalPayment_NotAttended_ThrowsException()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testStrategyFactory_ReturnsCorrectStrategy()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testStrategyFactory_UnknownType_ThrowsException()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testWebhook_Approved_Deposit_ConfirmsAppointment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testWebhook_Approved_Full_ConfirmsAppointment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testWebhook_QueryParams_Approved()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testWebhook_Rejected_MarksPaymentFailed()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[Appointment_7]] - code
- [[PaymentServiceTest]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[PaymentStrategyFactory]] - code - backend/src/main/java/com/clinicadermatologica/app/application/strategy/PaymentStrategyFactory.java
- [[org.junit.jupiter.api.DisplayName]] - code
- [[org.junit.jupiter.api.Test]] - code

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/orgjunitjupiterapiDisplayName
SORT file.name ASC
```

## Connections to other communities
- 20 edges to [[_COMMUNITY_AppointmentService]]
- 17 edges to [[_COMMUNITY_UserRepository]]
- 13 edges to [[_COMMUNITY_org.springframework.stereotype.Component]]
- 13 edges to [[_COMMUNITY_AesEncryptionService]]
- 12 edges to [[_COMMUNITY_lombok.extern.slf4j.Slf4j]]
- 10 edges to [[_COMMUNITY_PaymentServiceTest.java]]
- 8 edges to [[_COMMUNITY_dot-findById]]
- 7 edges to [[_COMMUNITY_org.springframework.transaction.annotation.Transactional]]
- 6 edges to [[_COMMUNITY_MedicalRecordService]]
- 6 edges to [[_COMMUNITY_AlergiaId]]
- 4 edges to [[_COMMUNITY_AppointmentController]]
- 2 edges to [[_COMMUNITY_AppointmentServiceTest.java]]
- 1 edge to [[_COMMUNITY_Appointment]]
- 1 edge to [[_COMMUNITY_User]]
- 1 edge to [[_COMMUNITY_dot-isExpired]]

## Top bridge nodes
- [[org.junit.jupiter.api.DisplayName]] - degree 41, connects to 8 communities
- [[org.junit.jupiter.api.Test]] - degree 41, connects to 8 communities
- [[PaymentServiceTest]] - degree 26, connects to 8 communities
- [[dot-registerDepositPayment()]] - degree 16, connects to 8 communities
- [[dot-registerFinalPayment()]] - degree 11, connects to 6 communities