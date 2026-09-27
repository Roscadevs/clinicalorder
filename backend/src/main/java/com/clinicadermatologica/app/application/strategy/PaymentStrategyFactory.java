package com.clinicadermatologica.app.application.strategy;

import com.clinicadermatologica.app.domain.exception.BusinessRuleException;
import com.clinicadermatologica.app.domain.model.PaymentType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * PATRÓN DE DISEÑO: Strategy — Selección en tiempo de ejecución
 *
 * Spring inyecta automáticamente todas las implementaciones de PaymentRegistrationStrategy
 * disponibles en el contexto. Este factory construye un mapa de PaymentType → estrategia
 * y expone getStrategy(PaymentType) para que PaymentService obtenga la estrategia correcta
 * sin condicionales sobre el tipo de pago.
 *
 * Para añadir un nuevo tipo de pago en el futuro, basta con crear una nueva implementación
 * de PaymentRegistrationStrategy — no es necesario modificar PaymentService ni este factory.
 */
@Component
@Slf4j
public class PaymentStrategyFactory {

    private final Map<PaymentType, PaymentRegistrationStrategy> strategies;

    /**
     * Spring inyecta la lista completa de beans que implementan PaymentRegistrationStrategy.
     * El constructor construye el mapa de lookup por PaymentType.
     */
    public PaymentStrategyFactory(List<PaymentRegistrationStrategy> strategyList) {
        this.strategies = strategyList.stream()
                .collect(Collectors.toMap(PaymentRegistrationStrategy::supportedType, s -> s));
        log.info("PaymentStrategyFactory: {} estrategias registradas: {}",
                strategies.size(), strategies.keySet());
    }

    /**
     * Retorna la estrategia correspondiente al tipo de pago solicitado.
     *
     * @param type el canal de pago requerido
     * @return la estrategia concreta que implementa ese tipo
     * @throws BusinessRuleException si el tipo de pago no tiene estrategia registrada
     */
    public PaymentRegistrationStrategy getStrategy(PaymentType type) {
        PaymentRegistrationStrategy strategy = strategies.get(type);
        if (strategy == null) {
            throw new BusinessRuleException("Tipo de pago no soportado: " + type);
        }
        return strategy;
    }
}
