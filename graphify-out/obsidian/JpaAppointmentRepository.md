---
source_file: "backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/jpa/JpaAppointmentRepository.java"
type: "code"
community: "Appointment"
location: "L17"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Appointment
---

# JpaAppointmentRepository

## Connections
- [[dot-findByDateRange()_3]] - `method` [EXTRACTED]
- [[dot-findByPatientIdOrderByStartTimeDesc()]] - `method` [EXTRACTED]
- [[dot-findByStatusAndCreatedAtBefore()]] - `method` [EXTRACTED]
- [[dot-findOverlappingActiveAppointments()]] - `method` [EXTRACTED]
- [[Appointment]] - `references` [EXTRACTED]
- [[AppointmentRepositoryAdapter]] - `references` [EXTRACTED]
- [[AppointmentRepositoryAdapter.java]] - `imports` [EXTRACTED]
- [[JpaAppointmentRepository.java]] - `contains` [EXTRACTED]
- [[org.springframework.data.jpa.repository.JpaRepository]] - `inherits` [EXTRACTED]
- [[org.springframework.stereotype.Repository]] - `references` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/Appointment