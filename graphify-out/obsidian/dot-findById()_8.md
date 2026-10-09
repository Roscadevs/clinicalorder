---
source_file: "backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java"
type: "code"
community: "org.junit.jupiter.api.DisplayName"
location: "L17"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/orgjunitjupiterapiDisplayName
---

# .findById()

## Connections
- [[dot-addClinicalEntry()]] - `calls` [INFERRED]
- [[dot-cancelAppointment()]] - `calls` [INFERRED]
- [[dot-getAppointmentById()]] - `calls` [INFERRED]
- [[dot-getAppointmentPublicStatus()]] - `calls` [INFERRED]
- [[dot-markAsAttended()]] - `calls` [INFERRED]
- [[dot-prepareHold()]] - `calls` [INFERRED]
- [[dot-registerDepositPayment()]] - `calls` [INFERRED]
- [[dot-registerFinalPayment()]] - `calls` [INFERRED]
- [[dot-testAddClinicalEntry_EncryptsContent()]] - `calls` [INFERRED]
- [[dot-testCancelAppointment_WithApprovedMercadoPagoPayment_TriggersRefund()]] - `calls` [INFERRED]
- [[dot-testGetAppointmentPublicStatus()]] - `calls` [INFERRED]
- [[dot-testMarkAsAttended_ConfirmedToAttended()]] - `calls` [INFERRED]
- [[dot-testMarkAsAttended_NotConfirmed_Throws()]] - `calls` [INFERRED]
- [[dot-testRegisterFinalPayment_DelegatesToStrategy_CompletesAppointment()]] - `calls` [INFERRED]
- [[dot-testRegisterFinalPayment_NotAttended_ThrowsException()]] - `calls` [INFERRED]
- [[Appointment]] - `references` [EXTRACTED]
- [[AppointmentRepository]] - `method` [EXTRACTED]

#graphify/code #graphify/INFERRED #community/orgjunitjupiterapiDisplayName