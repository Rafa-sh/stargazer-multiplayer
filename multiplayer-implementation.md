# Multiplayer Mod

## Analysis

### What does the PLAYER entity interact with?

- PLAYER has its own tab
- PLAYER has momentum
  - which is used by dice roller
- PLAYER has edge, heart, iron, shadow and wits.
  - which is used by the dice roller
- PLAYER has Assets assigned
- PLAYER has Legacy tracks (Quests, Bonds, Discoveries)
- PLAYER has impacts

### How does the code handle the PLAYER entity?

- player tab
- assigned attributes
- dice roller

### Files that look important

- src/components/Assets/Asset.vue
- src/components/Assets/AssetEditor.vue
- src/components/Assets/Assets.vue
- src/components/Stats/Stat.vue
- src/components/Stats/Stats.vue
- src/components/Tracks/LegacyTrack.vue
- src/components/Widgets/Roller.vue
- src/components/models.ts

- src/layouts/MainLayout.vue

- src/lib/assets.ts
- src/lib/campaign.ts
- src/lib/roll.ts
- src/lib/tracks.ts

- src/pages/Character.vue

- src/router/routes.ts

- src/store/assets.ts
- src/store/campaign.ts ?

- src/App.vue

## Design

### How would N PLAYERS entities interact with these?

- there's a "team" tab
  - each player data can be "folded"
- player selector on dice roller for momentum and stats
- make sure each character has internally their own set of attributes
  - name, pronouns, callsign, characteristics
  - momentum
  - health, spirit, supply
  - edge/heart/iron/shadow/wits
  - gear/notes
  - assets
  - legacy tracks (quests/bonds/discoveries)
  - impacts
