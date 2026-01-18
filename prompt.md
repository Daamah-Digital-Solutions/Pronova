Everything is working well — only one frontend UI issue remains.

The countdown is now controlled from presaleConfig.js, but the status message:

“This presale phase has ended!”

is still coming from on-chain phase logic.

This is causing a conflict:

Countdown → frontend config (active)

Status message → smart contract (expired)

Since we decided that countdown and phase display are frontend-only, please update the UI logic so that:

The “phase ended” message is driven only by presaleConfig.js

No UI status message depends on:

phase.isActive

currentPhase from contract

The smart contract should remain the source of truth only for purchase validation, not UI messaging.

Once the message uses the same frontend config as the countdown, this conflict will disappear.

Please fix this final UI inconsistency and redeploy the frontend.