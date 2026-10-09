---
source_file: "backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java"
type: "code"
community: "org.junit.jupiter.api.DisplayName"
location: "L36"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/orgjunitjupiterapiDisplayName
---

# PaymentServiceTest

## Connections
- [[dot-cash()]] - `method` [EXTRACTED]
- [[dot-prepareHold()]] - `method` [EXTRACTED]
- [[dot-setUp()_3]] - `method` [EXTRACTED]
- [[dot-testIsValidSignature_SuccessAndFailure()]] - `method` [EXTRACTED]
- [[dot-testRefundPayment_Success()]] - `method` [EXTRACTED]
- [[dot-testRegisterDeposit_AmountBelowDeposit_Throws()]] - `method` [EXTRACTED]
- [[dot-testRegisterDeposit_Cash_ConfirmsAppointment()]] - `method` [EXTRACTED]
- [[dot-testRegisterDeposit_ExpiredHold_CancelsAppointment()]] - `method` [EXTRACTED]
- [[dot-testRegisterDeposit_MercadoPago_Throws()]] - `method` [EXTRACTED]
- [[dot-testRegisterFinalPayment_DelegatesToStrategy_CompletesAppointment()]] - `method` [EXTRACTED]
- [[dot-testRegisterFinalPayment_NotAttended_ThrowsException()]] - `method` [EXTRACTED]
- [[dot-testStrategyFactory_ReturnsCorrectStrategy()]] - `method` [EXTRACTED]
- [[dot-testStrategyFactory_UnknownType_ThrowsException()]] - `method` [EXTRACTED]
- [[dot-testWebhook_AlreadyApproved_IsIdempotent()]] - `method` [EXTRACTED]
- [[dot-testWebhook_Approved_Deposit_ConfirmsAppointment()]] - `method` [EXTRACTED]
- [[dot-testWebhook_Approved_Full_ConfirmsAppointment()]] - `method` [EXTRACTED]
- [[dot-testWebhook_InProcess_MaintainsPendingAppointment()]] - `method` [EXTRACTED]
- [[dot-testWebhook_QueryParams_Approved()]] - `method` [EXTRACTED]
- [[dot-testWebhook_Rejected_MarksPaymentFailed()]] - `method` [EXTRACTED]
- [[Appointment_4]] - `references` [EXTRACTED]
- [[AppointmentRepository]] - `references` [EXTRACTED]
- [[MercadoPagoPaymentAdapter]] - `references` [EXTRACTED]
- [[PaymentService]] - `references` [EXTRACTED]
- [[PaymentServiceTest.java]] - `contains` [EXTRACTED]
- [[PaymentStrategyFactory]] - `references` [EXTRACTED]
- [[PaymentTransactionRepository]] - `references` [EXTRACTED]
- [[User]] - `references` [EXTRACTED]
- [[UserRepository]] - `references` [EXTRACTED]
- [[org.junit.jupiter.api.extension.ExtendWith]] - `references` [EXTRACTED]
- [[org.mockito.junit.jupiter.MockitoExtension]] - `references` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/orgjunitjupiterapiDisplayName