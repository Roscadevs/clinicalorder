package com.clinicadermatologica.app.infrastructure;

import com.clinicadermatologica.app.infrastructure.ai.GeminiApiClientAdapter;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.mock.env.MockEnvironment;

import static org.assertj.core.api.Assertions.assertThat;

class GeminiContextInstantiationTest {

    @Test
    @DisplayName("Debe instanciarse correctamente dentro del ApplicationContext de Spring IoC sin error de constructor")
    void shouldInstantiateInsideSpringApplicationContext() {
        try (AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext()) {
            MockEnvironment env = new MockEnvironment();
            env.setProperty("gemini.api.key", "test-api-key");
            env.setProperty("gemini.api.base-url", "https://generativelanguage.googleapis.com/v1beta");
            env.setProperty("gemini.api.model", "gemini-3.5-flash-lite");
            context.setEnvironment(env);
            context.register(GeminiApiClientAdapter.class);
            context.refresh();

            GeminiApiClientAdapter bean = context.getBean(GeminiApiClientAdapter.class);
            assertThat(bean).isNotNull();
            assertThat(bean.getModelsCascade()).contains("gemini-3.5-flash-lite");
        }
    }

    @Test
    @DisplayName("Debe instanciarse en Spring IoC incluso sin propiedades explícitas usando defaults")
    void shouldInstantiateInsideSpringApplicationContextWithMissingProperties() {
        try (AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext()) {
            context.register(GeminiApiClientAdapter.class);
            context.refresh();

            GeminiApiClientAdapter bean = context.getBean(GeminiApiClientAdapter.class);
            assertThat(bean).isNotNull();
            assertThat(bean.getModelsCascade()).contains("gemini-3.5-flash-lite");
        }
    }
}
