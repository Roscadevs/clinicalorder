---
source_file: "backend/src/test/java/com/clinicadermatologica/app/application/AppointmentServiceTest.java"
type: "code"
community: "AppointmentService"
location: "L32"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/AppointmentService
---

# AppointmentServiceTest

## Connections
- [[dot-setUp()]] - `method` [EXTRACTED]
- [[dot-testBookTemporaryHold_ExpiredOverlappingHold_IsReleased()]] - `method` [EXTRACTED]
- [[dot-testBookTemporaryHold_SlotUnavailable_ThrowsException()]] - `method` [EXTRACTED]
- [[dot-testBookTemporaryHold_Success()]] - `method` [EXTRACTED]
- [[dot-testCancelAppointment_WithApprovedMercadoPagoPayment_TriggersRefund()]] - `method` [EXTRACTED]
- [[dot-testGetAppointmentPublicStatus()]] - `method` [EXTRACTED]
- [[dot-testGetAvailableSlots()]] - `method` [EXTRACTED]
- [[dot-testMarkAsAttended_ConfirmedToAttended()]] - `method` [EXTRACTED]
- [[dot-testMarkAsAttended_NotConfirmed_Throws()]] - `method` [EXTRACTED]
- [[dot-testReleaseExpiredHolds_CancelsAndRejectsPendingPayment()]] - `method` [EXTRACTED]
- [[AppointmentRepository]] - `references` [EXTRACTED]
- [[AppointmentService]] - `references` [EXTRACTED]
- [[AppointmentServiceTest.java]] - `contains` [EXTRACTED]
- [[CalendarBlockRepository]] - `references` [EXTRACTED]
- [[DermatologicService_2]] - `references` [EXTRACTED]
- [[DermatologicServiceRepository]] - `references` [EXTRACTED]
- [[MercadoPagoPaymentAdapter]] - `references` [EXTRACTED]
- [[Patient_2]] - `references` [EXTRACTED]
- [[PatientRepository]] - `references` [EXTRACTED]
- [[PaymentService]] - `references` [EXTRACTED]
- [[PaymentTransactionRepository]] - `references` [EXTRACTED]
- [[User]] - `references` [EXTRACTED]
- [[UserRepository]] - `references` [EXTRACTED]
- [[org.junit.jupiter.api.extension.ExtendWith]] - `references` [EXTRACTED]
- [[org.mockito.junit.jupiter.MockitoExtension]] - `references` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/AppointmentService