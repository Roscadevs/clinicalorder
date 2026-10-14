# Hook PreToolUse: protege graphify-out/ de escrituras directas de agentes.
# Lee el contexto JSON del hook por stdin. Si la operacion apunta a graphify-out/,
# devuelve una decision "ask" para que el usuario confirme antes de proceder.
# En cualquier otro caso no imprime nada (deja pasar la operacion).

$ErrorActionPreference = 'SilentlyContinue'
$payload = [Console]::In.ReadToEnd()

if ($payload -match 'graphify-out') {
    $decision = @{
        hookSpecificOutput = @{
            permissionDecision       = 'ask'
            permissionDecisionReason = 'Estas por modificar un archivo dentro de graphify-out/, que es generado por graphify. No lo edites a mano: regeneralo con "graphify update . ; graphify export obsidian". Confirma solo si estas seguro de lo que haces.'
        }
    }
    Write-Output ($decision | ConvertTo-Json -Compress -Depth 5)
}

exit 0
