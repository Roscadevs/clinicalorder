# PRD FASE 25: Testing de Mutación Ad-Hoc sobre Operaciones Transaccionales y Blindaje de la Suite de Pruebas Backend

---

## 1. Encabezado y Resumen (Hoy vs. Después)

| Dimensión | Hoy | Después |
| :--- | :--- | :--- |
| **Métrica de Calidad del Software** | La calidad de la suite de pruebas se evalúa únicamente mediante cobertura tradicional de código (líneas/ramas) y un resultado booleano (114 pruebas en verde). Si una prueba ejecuta una línea sin aserciones estrictas sobre los efectos colaterales, el sistema aparenta estar probado sin estarlo. | Se incorpora **Testing de Mutación Ad-Hoc** como estándar de calidad industrial. Se mide el *Mutation Score*, demostrando empíricamente que la suite de pruebas es capaz de detectar y fallar ante fallas deliberadas inyectadas en las reglas de negocio. |
| **Cobertura de Operaciones de Auditoría Médica** | El método de actualización de entradas clínicas (`updateClinicalEntry`) y la ruta de modificación del expediente médico carecen de pruebas unitarias específicas. Si un desarrollador omite involuntariamente la inserción en el historial de auditoría o altera el cifrado confidencial, los 114 tests actuales continúan pasando sin advertirlo. | Se garantiza la detección inmediata de cualquier omisión en el registro de auditoría (`entrada_hc_audit` e `historia_clinica_audit`) o falla en el cifrado AES-256-GCM. Mutantes que omitan la auditoría son abatidos al 100% mediante aserciones estrictas sobre los objetos capturados. |
| **Reglas Financieras y Balances de Pagos** | Existen vacíos en las aserciones de límites de pago: el sistema no comprueba mediante tests unitarios qué ocurre si un paciente intenta abonar una seña superior al precio total pactado, o si se intentan contabilizar pagos rechazados al liquidar el saldo pendiente en mostrador. | Se blindan las reglas de balances financieros mediante mutantes sintéticos en cálculos de señas, validación de saldos remanentes y transiciones de estado de cobro. Toda alteración en el balance es detectada y abortada por la suite de pruebas. |
| **Seguridad de Operadores y Anti-Lockout** | Las validaciones de registro de operadores en el servicio de autenticación y los matices de la regla de anti-bloqueo del administrador en sesión carecen de pruebas de mutación que desafíen su robustez ante descuidos de codificación (ej. persistir contraseñas en texto plano). | Se inyectan mutantes que intentan desactivar la protección anti-lockout o suprimir el cifrado seguro de contraseñas con BCrypt, verificando que la suite de pruebas rechace de inmediato cualquier degradación de seguridad. |
| **Harness de Ejecución Automatizada y Respaldo** | No existe en el proyecto una herramienta para evaluar la efectividad de las pruebas frente a código defectuoso de manera segura y reproducible. | Se implementa un arnés automatizado de ejecución de mutaciones que crea respaldos inmutables de los archivos originales, ejecuta pruebas selectivas ultrarrápidas, evalúa el estado del mutante y garantiza la restauración atómica del código fuente sin dejar modificaciones residuales en el repositorio. |

---

## 2. La Historia (Antes vs. Después, sin tecnicismos)

### Antes:
En la clínica dermatológica, el equipo técnico confiaba plenamente en un informe que indicaba que todas las pruebas automatizadas del sistema estaban en verde. Sin embargo, esta sensación de seguridad era engañosa. Era como tener instalada una alarma contra incendios en una habitación donde los sensores de humo no estaban conectados a la sirena: la alarma reportaba estar "activa", pero si alguien encendía fuego, la sirena jamás sonaría.

En el código del sistema médico ocurría exactamente eso. Si por un error involuntario durante una actualización se borraba la instrucción que registra quién modificó una nota clínica sensible, o si se alteraba la fórmula que calcula cuánto debe abonar un paciente de seña al reservar un tratamiento, las pruebas automáticas seguían aprobando el sistema como si todo estuviera perfecto. El sistema aprobaba revisiones técnicas con puntos ciegos invisibles que podían provocar pérdidas financieras, fallos de seguridad o contingencias legales por falta de trazabilidad médica.

### Después:
El equipo implementa la metodología del "abogado del diablo" tecnológico: el Testing de Mutación. Ahora, un asistente de control de calidad altamente riguroso toma el sistema y, de manera controlada y temporal, introduce pequeños defectos simulados ("mutantes") en las partes más delicadas de la clínica: cambia fórmulas de cálculo de dinero, simula que la auditoría médica no se guarda, finge que un administrador puede suspenderse a sí mismo por error, o altera las fechas para permitir turnos en el pasado.

Luego de inyectar cada defecto, el asistente ejecuta las pruebas automáticas para comprobar si las alarmas suenan. Si la prueba falla ante el defecto simulado, el mutante es considerado "abatido" (la alarma funcionó). Pero si la prueba pasa por alto el defecto y no suena ninguna alarma, el mutante resulta "superviviente": se enciende una luz roja inmediata que exige a los ingenieros crear una nueva prueba especializada para blindar ese caso de borde. Al finalizar el proceso, el sistema original se restaura intacto y la clínica cuenta con la certeza matemática de que cada regla crítica está respaldada por alarmas activas y comprobadas al 100%.

---

## 3. Objetivos y No-Objetivos

### Objetivos:
1. **Catalogación Exhaustiva de Operaciones Transaccionales Críticas:** Identificar y documentar todas las funciones transaccionales del backend que gestionan balances financieros, registros de auditoría médica, seguridad de usuarios, bloqueos de calendario y tratamientos.
2. **Definición de Catálogo de Mutantes Sintéticos:** Diseñar un catálogo exhaustivo de al menos 32 mutantes sintéticos representativos distribuidos en 4 áreas fundamentales:
   - Balances y Pagos.
   - Auditoría Legal e Invariantes Médicas.
   - Concurrencia Optimista y Seguridad.
   - Validaciones Temporales y Unicidad de Dominio.
3. **Construcción de un Arnés de Mutación Seguro y Confiable:** Desarrollar un mecanismo automatizado capaz de aplicar temporalmente cada mutante de forma aislada, ejecutar las pruebas pertinentes en segundos, clasificar el resultado (Abatido o Superviviente) y restaurar de manera incondicional e inmutable el archivo original garantizando un árbol de código limpio.
4. **Fortalecimiento de la Suite de Pruebas Unitarias:** Para cada mutante que resulte inicialmente superviviente debido a vacíos en las pruebas preexistentes, diseñar e incorporar pruebas unitarias complementarias en JUnit 5 y Mockito que cierren la brecha de verificación.
5. **Alcanzar un Mutation Score del 100%:** Demostrar que todos y cada uno de los mutantes catalogados son efectivamente abatidos por la suite de pruebas fortalecida, manteniendo al mismo tiempo el 100% de éxito en la suite de pruebas original sin regresiones.
6. **Preservación Estricta de Invariantes del Repositorio:** Garantizar la integridad absoluta de las tablas de auditoría (`entrada_hc_audit`, `historia_clinica_audit`) y las columnas de concurrencia optimista (`version` en citas), sin migraciones destructivas de base de datos.

### No-Objetivos:
- No se incorporarán complementos o librerías externas pesadas de mutación a nivel de bytecode (como Pitest) que puedan desestabilizar la configuración de compilación de Maven o el entorno de integración continua.
- No se alterarán los contratos de las APIs REST ni los esquemas de respuestas de error basados en el estándar RFC 7807.
- No se realizarán refactorizaciones cosméticas ni reescrituras de código productivo fuera de lo estrictamente necesario para la verificación de invariantes y aserciones.
- No se modificarán las interfaces gráficas de usuario en el frontend, ya que el alcance de esta fase se centra exclusivamente en la solidez del motor transaccional del backend.

---

## 4. Cómo funciona hoy vs. después

### Flujo de Verificación Tradicional (Hoy):
1. El desarrollador o el pipeline ejecuta el comando de pruebas unitarias del backend.
2. Maven compila el código y ejecuta las 114 pruebas unitarias existentes en aproximadamente 4 segundos.
3. Si ninguna prueba arroja una aserción fallida o una excepción no controlada, la consola muestra "BUILD SUCCESS".
4. Sin embargo, no existe ninguna verificación sobre si esas pruebas realmente validarían que:
   - El historial médico guarde la versión previa antes de sobreescribirla.
   - El cobro de saldo en mostrador no acepte un importe inferior o superior a la deuda real.
   - El sistema rechace la cancelación de un turno que el médico ya completó y atendió.
   - La contraseña de un operador se cifre con algoritmo criptográfico seguro antes de persistirse.
5. Los defectos potenciales permanecen latentes sin ser detectados por el sistema de construcción.

### Flujo de Testing de Mutación Ad-Hoc y Blindaje (Después):
1. **Lectura y Selección del Mutante:** El arnés de mutación lee de forma secuencial una entrada del catálogo de mutantes sintéticos.
2. **Respaldo Inmutable:** Antes de tocar cualquier línea en el disco, el arnés genera una copia de seguridad en memoria y un archivo de respaldo físico del archivo fuente que será modificado.
3. **Inyección Quirúrgica:** El arnés aplica una sustitución exacta de texto en el archivo Java correspondiente, introduciendo el defecto semántico específico (por ejemplo, omitiendo el guardado de la auditoría o alterando el cálculo del saldo).
4. **Ejecución Selectiva de Pruebas:**
   - En primera instancia, el arnés lanza la clase de pruebas directamente asociada al servicio afectado mediante Maven, obteniendo retroalimentación en menos de 2 segundos.
   - Si la prueba unitaria falla, el mutante se clasifica de inmediato como **ABATIDO (KILLED)**.
   - Si la prueba unitaria pasa con éxito, el arnés ejecuta la suite completa de pruebas para determinar si otra prueba de integración lo detecta. Si la suite completa también pasa, el mutante se clasifica como **SUPERVIVIENTE (SURVIVED)**.
5. **Restauración Atómica Obligatoria:** Dentro de un bloque de garantía incondicional (incluso si el proceso se interrumpe o cancela), el arnés sobreescribe el archivo con el respaldo original y verifica mediante control de versiones que no exista ninguna diferencia residual en el código fuente.
6. **Ciclo de Fortalecimiento:**
   - Ante cada mutante clasificado como superviviente, se redacta de inmediato la prueba unitaria JUnit 5 correspondiente en la clase de test del servicio.
   - La nueva prueba utiliza capturadores de argumentos o verificaciones de excepciones que inspeccionan los efectos colaterales de la operación.
   - Se re-ejecuta el mutante contra la suite fortalecida para confirmar que ahora sí resulta abatido.
7. **Reporte Final de Calidad:** Una vez procesado todo el catálogo, se calcula el índice de efectividad (Mutation Score), verificando que alcance el 100% de abatimiento con cero supervivientes.

### Matriz de Resiliencia ante Contingencias del Arnés:
- **Cancelación Inesperada por Usuario (Interrupción del Proceso):** El arnés intercepta las señales del sistema operativo y ejecuta la restauración inmediata del archivo fuente original antes de finalizar.
- **Error de Sintaxis o Compilación en el Mutante:** Si un mutante no compila, se clasifica como error de compilación y no se contabiliza erróneamente como abatido por la suite de pruebas.
- **Tiempos Excesivos de Ejecución:** Si una mutación introduce un bucle o demora anómala superior al límite configurado, se aborta y se clasifica como tiempo agotado.

---

## 5. Los Datos (Triggers, candados lógicos, concurrencia, invariantes de clinical_entries_audit y @Version)

### 1. Invariantes de Auditoría Médica Legal (`clinical_entries_audit` y `historia_clinica_audit`)
- **Regla Legal Fundamental:** De acuerdo con la Ley de Derechos del Paciente e Historia Clínica (Ley 26.529), toda modificación sobre una evolución o dato clínico debe conservar un registro inmutable del contenido histórico previo, la nueva versión, el médico actuante y la marca temporal exacta.
- **Estructura en Base de Datos:**
  - Tabla `entrada_hc_audit`: almacena el identificador de la entrada clínica, el usuario que realizó el cambio, el contenido previo cifrado (`bytea`) y el nuevo contenido cifrado (`bytea`).
  - Tabla `historia_clinica_audit`: almacena el historial de modificaciones del encabezado y antecedentes de la historia clínica, con instantáneas en formato estructurado (JSON).
- **Candado de Cifrado AES-256-GCM:** Toda información médica textual debe ser cifrada en la capa de servicio antes de ser transmitida a la base de datos o a las tablas de auditoría. Está estrictamente prohibido persistir datos de salud en texto plano.

### 2. Invariante de Concurrencia Optimista (`@Version` y Bloqueos de Agenda)
- **Control de Colisiones en Citas:** La tabla de citas dispone de una columna dedicada para control de concurrencia optimista (`version BIGINT NOT NULL DEFAULT 0`). Cualquier modificación concurrente de estado sobre la misma cita debe ser rechazada para evitar sobreescrituras silenciosas.
- **Candado Lógico Temporal (*Hold Policy*):** Una reserva temporal de turno dispone de una ventana de expiración estricta de 10 minutos. Si la seña no se confirma dentro de ese lapso, el turno se libera automáticamente para que otros pacientes puedan seleccionarlo, impidiendo la retención indefinida de horarios.

### 3. Candados de Balances y Reglas Financieras
- **Cálculo de Seña:** El valor de la seña se calcula multiplicando el precio base acordado por el porcentaje configurado en el catálogo del tratamiento, dividido por 100, con redondeo financiero estándar.
- **Cota Mínima y Máxima de Pago de Seña:**
  - El monto abonado no puede ser inferior al importe requerido de la seña.
  - El monto abonado no puede superar el precio total pactado para el tratamiento.
- **Liquidación de Saldo Remanente:** El saldo pendiente de un turno se calcula restando la totalidad de los pagos previamente aprobados al precio total acordado. Solo se permite liquidar el saldo de turnos que hayan sido previamente atendidos por el profesional médico (`estado = ATENDIDO`). Si el saldo resultante es menor o igual a cero, o si el monto presentado para cobrar no coincide exactamente con la deuda pendiente, la transacción debe ser rechazada de forma tajante.

### 4. Candados de Seguridad Administrativa y Anti-Lockout
- **Regla Anti-Bloqueo de Administrador (*Anti-Lockout*):** Un operador con sesión activa iniciada no puede suspender ni desactivar su propia cuenta de usuario. Si intenta hacerlo, el sistema debe emitir una excepción de regla de negocio impidiendo la operación.
- **Seguridad en Credenciales:** Toda contraseña provista al registrar o actualizar un usuario debe poseer una longitud mínima de 8 caracteres y debe transformarse obligatoriamente mediante una función de resumen criptográfico irreversible (BCrypt con factor de costo adecuado) antes de almacenarse en la base de datos.
- **Unicidad Excluyente de Operadores:** Al modificar los datos de un operador, el nombre de usuario y la dirección de correo electrónico no pueden coincidir con los de ningún otro operador activo en el sistema, exceptuando al propio usuario que se está editando.

### 5. Candados de Validez Temporal de la Agenda
- **Validación de Fechas Pasadas:** No es posible reservar un turno médico cuya fecha y hora de inicio pertenezca al pasado en relación con el momento de la solicitud.
- **Consistencia de Intervalos:** En cualquier bloqueo de calendario o cita médica, la fecha y hora de finalización debe ser estrictamente posterior a la fecha y hora de inicio.
- **Exclusión de Solapamientos:** Un turno no puede confirmarse si coincide temporalmente con un bloqueo médico de agenda o con otra cita médica en estado confirmado o en proceso de pago activo.

---

## 6. Pseudo-código (El acuerdo en lenguaje natural)

```text
MODULO: ArnésDeTestingDeMutaciónAdHoc

ESTRUCTURA Mutante:
    identificador: Texto
    categoria: Texto
    servicioObjetivo: Texto
    rutaArchivo: Texto
    lineaAproximada: Numero
    codigoOriginal: Texto
    codigoMutado: Texto
    clasePruebaObjetivo: Texto
    descripcion: Texto
FIN ESTRUCTURA

METODO ejecutarCampañaDeMutación(catálogoDeMutantes):
    mutantesAbatidos = 0
    mutantesSupervivientes = 0
    erroresDeCompilacion = 0
    resultados = ListaVacia()

    Para cada mutante en catálogoDeMutantes:
        EscribirMensaje("Evaluando mutante: " + mutante.identificador + " en " + mutante.servicioObjetivo)
        
        // 1. Respaldo Inmutable
        contenidoOriginal = LeerArchivoComoTexto(mutante.rutaArchivo)
        CrearArchivoDeRespaldo(mutante.rutaArchivo + ".original_bak", contenidoOriginal)

        estadoMutante = "DESCONOCIDO"

        Intentar:
            // 2. Inyección Quirúrgica
            Si NO ContieneTexto(contenidoOriginal, mutante.codigoOriginal):
                LanzarExcepcion("El código original esperado no se encontró exactamente en el archivo objetivo.")
            FinSi

            contenidoMutado = ReemplazarTextoUnicaVez(contenidoOriginal, mutante.codigoOriginal, mutante.codigoMutado)
            SobreescribirArchivo(mutante.rutaArchivo, contenidoMutado)

            // 3. Ejecución de Pruebas Selectivas
            resultadoPrueba = EjecutarComandoEnDirectorioBackend("mvn test -Dtest=" + mutante.clasePruebaObjetivo)

            Si resultadoPrueba.huboErrorDeCompilacion:
                estadoMutante = "ERROR_COMPILACION"
                erroresDeCompilacion = erroresDeCompilacion + 1
            Sino Si resultadoPrueba.fallaronPruebas:
                estadoMutante = "ABATIDO"
                mutantesAbatidos = mutantesAbatidos + 1
            Sino:
                // La prueba específica pasó. Correr suite completa para confirmar supervivencia
                resultadoSuiteCompleta = EjecutarComandoEnDirectorioBackend("mvn test")
                Si resultadoSuiteCompleta.fallaronPruebas:
                    estadoMutante = "ABATIDO"
                    mutantesAbatidos = mutantesAbatidos + 1
                Sino:
                    estadoMutante = "SUPERVIVIENTE"
                    mutantesSupervivientes = mutantesSupervivientes + 1
                FinSi
            FinSi

        Finalmente:
            // 4. Restauración Atómica Garantizada
            SobreescribirArchivo(mutante.rutaArchivo, contenidoOriginal)
            EliminarArchivoSiExiste(mutante.rutaArchivo + ".original_bak")
            
            // Verificación estricta de árbol limpio
            diferenciasGit = EjecutarComando("git diff --exit-code " + mutante.rutaArchivo)
            Si diferenciasGit.codigoSalida != 0:
                LanzarExcepcionFatal("Alerta de integridad: el archivo no quedó idéntico a su estado original.")
            FinSi
        FinIntentar

        RegistrarResultado(resultados, mutante.identificador, estadoMutante)
    FinPara

    totalValidos = mutantesAbatidos + mutantesSupervivientes
    puntuacionMutacion = (mutantesAbatidos / totalValidos) * 100

    EscribirReporteFinal(puntuacionMutacion, mutantesAbatidos, mutantesSupervivientes, erroresDeCompilacion)
    Retornar resultados
FIN METODO


MODULO: ReglaDeAuditoríaMédicaEnActualizacion

METODO actualizarEvoluciónClínica(identificadorEntrada, nuevoTextoContenido, identificadorMédicoAutor):
    entradaExistente = buscarEntradaPorIdentificador(identificadorEntrada) o lanzar NoEncontrado
    médico = buscarUsuarioPorIdentificador(identificadorMédicoAutor) o lanzar NoEncontrado

    // Invariante de seguridad: cifrado confidencial obligatorio
    nuevoContenidoCifrado = servicioCifradoAES.cifrar(nuevoTextoContenido)

    // Invariante legal: construcción de instantánea inmutable en tabla de auditoría
    registroAuditoría = ConstruirAuditoría(
        entrada = entradaExistente,
        autorModificación = médico,
        contenidoPrevio = entradaExistente.obtenerContenidoCifrado(), // Snapshot intacto
        nuevoContenido = nuevoContenidoCifrado,
        fechaHora = MomentoActual()
    )

    // Inserción obligatoria en entrada_hc_audit antes de actualizar la entrada viva
    repositorioAuditoría.guardarAuditoría(registroAuditoría)

    // Actualización de la entrada activa
    entradaExistente.establecerContenidoCifrado(nuevoContenidoCifrado)
    repositorioEntradas.guardar(entradaExistente)

    Retornar MapearADTO(entradaExistente)
FIN METODO


MODULO: ReglaDeLiquidaciónDeSaldoFinalEnMostrador

METODO liquidarSaldoTurnoAtendido(identificadorTurno, montoAbonado, identificadorOperador):
    turno = buscarTurnoPorIdentificador(identificadorTurno) o lanzar NoEncontrado

    // Invariante de estado: solo turnos atendidos pueden liquidar saldo final
    Si turno.obtenerEstado() != ESTADO_ATENDIDO:
        Lanzar ReglaDeNegocioExcepcion("Solo se puede liquidar el saldo de turnos que hayan sido atendidos por el médico.")
    FinSi

    // Invariante de cálculo: sumar exclusivamente transacciones con estado APROBADO
    transacciones = buscarTransaccionesPorTurno(identificadorTurno)
    totalPagadoPreviamente = Cero
    Para cada tx en transacciones:
        Si tx.obtenerEstado() == ESTADO_APROBADO:
            totalPagadoPreviamente = totalPagadoPreviamente + tx.obtenerMonto()
        FinSi
    FinPara

    precioAcordado = turno.obtenerPrecioPactado()
    saldoPendiente = precioAcordado - totalPagadoPreviamente

    Si saldoPendiente <= Cero:
        Lanzar ReglaDeNegocioExcepcion("El turno no posee saldo pendiente de pago.")
    FinSi

    Si montoAbonado != saldoPendiente:
        Lanzar ReglaDeNegocioExcepcion("El monto a cobrar no coincide exactamente con el saldo pendiente.")
    FinSi

    // Registrar cobro y pasar turno a completado
    nuevaTransacción = CrearTransacciónDePago(
        turno = turno,
        concepto = CONCEPTO_SALDO,
        monto = montoAbonado,
        estado = ESTADO_APROBADO
    )
    guardarTransacción(nuevaTransacción)

    turno.establecerEstado(ESTADO_COMPLETADO)
    guardarTurno(turno)

    Retornar GenerarComprobanteDeCobro(turno, nuevaTransacción)
FIN METODO
```
