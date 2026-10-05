---
type: community
members: 31
---

# org.junit.jupiter.api.DisplayName

**Members:** 31 nodes

## Members
- [[dot-cash()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-findById()_7]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
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
- [[Appointment_4]] - code
- [[PaymentService]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/PaymentService.java
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
- 21 edges to [[_COMMUNITY_AppointmentService]]
- 14 edges to [[_COMMUNITY_PaymentServiceTest.java]]
- 13 edges to [[_COMMUNITY_AesEncryptionService]]
- 11 edges to [[_COMMUNITY_lombok.extern.slf4j.Slf4j]]
- 9 edges to [[_COMMUNITY_lombok.RequiredArgsConstructor]]
- 8 edges to [[_COMMUNITY_org.springframework.stereotype.Component]]
- 8 edges to [[_COMMUNITY_dot-findById]]
- 7 edges to [[_COMMUNITY_org.springframework.transaction.annotation.Transactional]]
- 6 edges to [[_COMMUNITY_MedicalRecordService]]
- 6 edges to [[_COMMUNITY_AlergiaId]]
- 6 edges to [[_COMMUNITY_dot-login]]
- 5 edges to [[_COMMUNITY_dot-save]]
- 3 edges to [[_COMMUNITY_MercadoPagoPaymentAdapter]]
- 2 edges to [[_COMMUNITY_UserRepository]]
- 2 edges to [[_COMMUNITY_dot-register_2]]
- 2 edges to [[_COMMUNITY_dot-forgotPassword]]
- 2 edges to [[_COMMUNITY_AppointmentServiceTest.java]]
- 1 edge to [[_COMMUNITY_PaymentTransaction]]
- 1 edge to [[_COMMUNITY_Appointment]]
- 1 edge to [[_COMMUNITY_User]]
- 1 edge to [[_COMMUNITY_AppointmentResponseDTO]]
- 1 edge to [[_COMMUNITY_dot-isExpired]]

## Top bridge nodes
- [[org.junit.jupiter.api.DisplayName]] - degree 41, connects to 10 communities
- [[org.junit.jupiter.api.Test]] - degree 41, connects to 10 communities
- [[PaymentServiceTest]] - degree 26, connects to 8 communities
- [[PaymentService]] - degree 20, connects to 8 communities
- [[dot-registerDepositPayment()]] - degree 16, connects to 7 communities