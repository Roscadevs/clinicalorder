---
type: community
members: 30
---

# org.junit.jupiter.api.DisplayName

**Members:** 30 nodes

## Members
- [[dot-cash()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-findByMpPreferenceId()_2]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/PaymentTransactionRepository.java
- [[dot-getPaymentDetails()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/payment/MercadoPagoPaymentAdapter.java
- [[dot-getStrategy()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/strategy/PaymentStrategyFactory.java
- [[dot-isValidSignature()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/PaymentService.java
- [[dot-prepareHold()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-processMercadoPagoWebhook()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/PaymentService.java
- [[dot-testInvalidKeyLengthThrows()]] - code - backend/src/test/java/com/clinicadermatologica/app/infrastructure/AesEncryptionServiceTest.java
- [[dot-testIsValidSignature_SuccessAndFailure()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testRefundPayment_Success()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testRegisterDeposit_AmountBelowDeposit_Throws()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testRegisterDeposit_Cash_ConfirmsAppointment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testRegisterDeposit_ExpiredHold_CancelsAppointment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testRegisterDeposit_MercadoPago_Throws()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testRegisterFinalPayment_DelegatesToStrategy_CompletesAppointment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testRegisterFinalPayment_NotAttended_ThrowsException()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testRemoveAlergia_NotFound_Throws()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/MedicalRecordServiceTest.java
- [[dot-testStrategyFactory_ReturnsCorrectStrategy()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testStrategyFactory_UnknownType_ThrowsException()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testWebhook_AlreadyApproved_IsIdempotent()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testWebhook_Approved_Deposit_ConfirmsAppointment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testWebhook_Approved_Full_ConfirmsAppointment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testWebhook_InProcess_MaintainsPendingAppointment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testWebhook_QueryParams_Approved()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testWebhook_Rejected_MarksPaymentFailed()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[Appointment_4]] - code
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
- 18 edges to [[_COMMUNITY_lombok.extern.slf4j.Slf4j]]
- 13 edges to [[_COMMUNITY_PaymentService]]
- 13 edges to [[_COMMUNITY_AesEncryptionService]]
- 12 edges to [[_COMMUNITY_dot-bookTemporaryHold]]
- 9 edges to [[_COMMUNITY_PaymentServiceTest.java]]
- 7 edges to [[_COMMUNITY_lombok.RequiredArgsConstructor]]
- 5 edges to [[_COMMUNITY_MedicalRecordService]]
- 5 edges to [[_COMMUNITY_dot-addAlergia]]
- 3 edges to [[_COMMUNITY_PaymentTransaction]]
- 2 edges to [[_COMMUNITY_org.springframework.transaction.annotation.Transactional]]
- 2 edges to [[_COMMUNITY_AlergiaId]]
- 2 edges to [[_COMMUNITY_MedicalRecordDTO]]
- 2 edges to [[_COMMUNITY_AppointmentServiceTest.java]]
- 1 edge to [[_COMMUNITY_User]]
- 1 edge to [[_COMMUNITY_PaymentWebhookController]]

## Top bridge nodes
- [[org.junit.jupiter.api.DisplayName]] - degree 47, connects to 9 communities
- [[org.junit.jupiter.api.Test]] - degree 47, connects to 9 communities
- [[PaymentServiceTest]] - degree 30, connects to 8 communities
- [[dot-processMercadoPagoWebhook()]] - degree 17, connects to 5 communities
- [[PaymentStrategyFactory]] - degree 13, connects to 5 communities