---
source_file: "backend/src/main/java/com/clinicadermatologica/app/domain/model/AppointmentStatus.java"
type: "code"
community: "AppointmentStatus"
location: "L6"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/AppointmentStatus
---

# AppointmentStatus

## Connections
- [[dot-findByStatusAndCreatedAtBefore()]] - `references` [EXTRACTED]
- [[ATTENDED]] - `case_of` [EXTRACTED]
- [[Appointment]] - `references` [EXTRACTED]
- [[AppointmentRepositoryAdapter.java]] - `imports` [EXTRACTED]
- [[AppointmentResponseDTO]] - `references` [EXTRACTED]
- [[AppointmentResponseDTO.java]] - `imports` [EXTRACTED]
- [[AppointmentStatus.java]] - `contains` [EXTRACTED]
- [[CANCELED]] - `case_of` [EXTRACTED]
- [[COMPLETED]] - `case_of` [EXTRACTED]
- [[CONFIRMED]] - `case_of` [EXTRACTED]
- [[JpaAppointmentRepository.java]] - `imports` [EXTRACTED]
- [[NO_SHOW]] - `case_of` [EXTRACTED]
- [[PAYMENT_FAILED]] - `case_of` [EXTRACTED]
- [[PENDING_PAYMENT]] - `case_of` [EXTRACTED]
- [[PaymentReceiptDTO]] - `references` [EXTRACTED]
- [[PaymentReceiptDTO.java]] - `imports` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/AppointmentStatus