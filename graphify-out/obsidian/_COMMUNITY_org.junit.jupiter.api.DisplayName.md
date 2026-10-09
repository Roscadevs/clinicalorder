---
type: community
members: 43
---

# org.junit.jupiter.api.DisplayName

**Members:** 43 nodes

## Members
- [[dot-cash()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-decrypt()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/AesEncryptionService.java
- [[dot-encrypt()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/AesEncryptionService.java
- [[dot-findById()_8]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java
- [[dot-findByMpPreferenceId()_2]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/PaymentTransactionRepository.java
- [[dot-getAppointmentById()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-getAppointmentPublicStatus()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-getPaymentDetails()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/payment/MercadoPagoPaymentAdapter.java
- [[dot-isValidSignature()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/PaymentService.java
- [[dot-markAsAttended()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java
- [[dot-prepareHold()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-processMercadoPagoWebhook()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/PaymentService.java
- [[dot-register()_3]] - code - backend/src/main/java/com/clinicadermatologica/app/application/strategy/PaymentRegistrationStrategy.java
- [[dot-registerDepositPayment()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/PaymentService.java
- [[dot-testAddClinicalEntry_EncryptsContent()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/MedicalRecordServiceTest.java
- [[dot-testGetAppointmentPublicStatus()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testIsValidSignature_SuccessAndFailure()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testMarkAsAttended_ConfirmedToAttended()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testMarkAsAttended_NotConfirmed_Throws()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java
- [[dot-testRefundPayment_Success()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testRegisterDeposit_AmountBelowDeposit_Throws()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testRegisterDeposit_Cash_ConfirmsAppointment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testRegisterDeposit_ExpiredHold_CancelsAppointment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testRegisterDeposit_MercadoPago_Throws()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testRegisterFinalPayment_DelegatesToStrategy_CompletesAppointment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testRegisterFinalPayment_NotAttended_ThrowsException()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testRoundTrip()]] - code - backend/src/test/java/com/clinicadermatologica/app/infrastructure/AesEncryptionServiceTest.java
- [[dot-testStrategyFactory_UnknownType_ThrowsException()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testTamperedCiphertextThrows()]] - code - backend/src/test/java/com/clinicadermatologica/app/infrastructure/AesEncryptionServiceTest.java
- [[dot-testUnicodeContent()]] - code - backend/src/test/java/com/clinicadermatologica/app/infrastructure/AesEncryptionServiceTest.java
- [[dot-testUniqueIvPerEncryption()]] - code - backend/src/test/java/com/clinicadermatologica/app/infrastructure/AesEncryptionServiceTest.java
- [[dot-testWebhook_AlreadyApproved_IsIdempotent()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testWebhook_Approved_Deposit_ConfirmsAppointment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testWebhook_Approved_Full_ConfirmsAppointment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testWebhook_InProcess_MaintainsPendingAppointment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testWebhook_QueryParams_Approved()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testWebhook_Rejected_MarksPaymentFailed()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[Appointment_5]] - code
- [[Appointment_6]] - code
- [[PaymentConcept_5]] - code
- [[PaymentServiceTest]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[org.junit.jupiter.api.DisplayName]] - code
- [[org.junit.jupiter.api.Test]] - code

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/orgjunitjupiterapiDisplayName
SORT file.name ASC
```

## Connections to other communities
- 33 edges to [[_COMMUNITY_AppointmentService]]
- 24 edges to [[_COMMUNITY_lombok.RequiredArgsConstructor]]
- 21 edges to [[_COMMUNITY_UserRepository]]
- 20 edges to [[_COMMUNITY_MedicalRecordServiceTest]]
- 9 edges to [[_COMMUNITY_org.springframework.transaction.annotation.Transactional]]
- 5 edges to [[_COMMUNITY_MedicalRecordService]]
- 4 edges to [[_COMMUNITY_org.springframework.http.ResponseEntity]]
- 2 edges to [[_COMMUNITY_PaymentTransaction]]
- 2 edges to [[_COMMUNITY_User]]
- 2 edges to [[_COMMUNITY_RegisterPaymentRequestDTO]]
- 2 edges to [[_COMMUNITY_MedicalRecordController]]
- 1 edge to [[_COMMUNITY_AppointmentResponseDTO]]
- 1 edge to [[_COMMUNITY_Appointment]]
- 1 edge to [[_COMMUNITY_PaymentReceiptDTO]]
- 1 edge to [[_COMMUNITY_dot-isExpired]]

## Top bridge nodes
- [[dot-registerDepositPayment()]] - degree 16, connects to 7 communities
- [[org.junit.jupiter.api.DisplayName]] - degree 47, connects to 5 communities
- [[org.junit.jupiter.api.Test]] - degree 47, connects to 5 communities
- [[PaymentServiceTest]] - degree 30, connects to 5 communities
- [[dot-findById()_8]] - degree 17, connects to 4 communities