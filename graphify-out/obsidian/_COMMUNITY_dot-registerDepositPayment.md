---
type: community
members: 10
---

# .registerDepositPayment

**Members:** 10 nodes

## Members
- [[dot-cash()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-prepareHold()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-register()_4]] - code - backend/src/main/java/com/clinicadermatologica/app/application/strategy/PaymentRegistrationStrategy.java
- [[dot-registerDepositPayment()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/PaymentService.java
- [[dot-testRegisterDeposit_AmountBelowDeposit_Throws()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testRegisterDeposit_Cash_ConfirmsAppointment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testRegisterDeposit_ExpiredHold_CancelsAppointment()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[dot-testRegisterDeposit_MercadoPago_Throws()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java
- [[Appointment_8]] - code
- [[PaymentConcept_5]] - code

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/registerDepositPayment
SORT file.name ASC
```

## Connections to other communities
- 8 edges to [[_COMMUNITY_org.junit.jupiter.api.DisplayName]]
- 6 edges to [[_COMMUNITY_PaymentServiceTest]]
- 5 edges to [[_COMMUNITY_PaymentServiceTest.java]]
- 4 edges to [[_COMMUNITY_dot-bookTemporaryHold]]
- 4 edges to [[_COMMUNITY_AppointmentServiceTest]]
- 2 edges to [[_COMMUNITY_org.springframework.transaction.annotation.Transactional]]
- 1 edge to [[_COMMUNITY_org.springframework.stereotype.Component]]
- 1 edge to [[_COMMUNITY_Appointment]]
- 1 edge to [[_COMMUNITY_User]]
- 1 edge to [[_COMMUNITY_AppointmentService]]
- 1 edge to [[_COMMUNITY_org.springframework.http.ResponseEntity]]
- 1 edge to [[_COMMUNITY_dot-getAvailableSlots]]

## Top bridge nodes
- [[dot-registerDepositPayment()_1]] - degree 16, connects to 8 communities
- [[dot-testRegisterDeposit_Cash_ConfirmsAppointment()]] - degree 10, connects to 5 communities
- [[dot-register()_4]] - degree 7, connects to 4 communities
- [[dot-prepareHold()]] - degree 6, connects to 2 communities
- [[dot-testRegisterDeposit_AmountBelowDeposit_Throws()]] - degree 6, connects to 2 communities