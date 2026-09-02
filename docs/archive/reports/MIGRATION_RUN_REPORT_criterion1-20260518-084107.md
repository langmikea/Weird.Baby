# Migration Run Report - Criterion 1 (tag namespacing)

**Run:** 2026-05-18T08:41:07.704978
**Artifacts updated:** 80
**Authority:** docs/SLUG_NAMESPACE_MAP.md

## unsorted: values (per v2.1-target 5.5 / 12.1)

Distinct values: 47

- `unsorted:advance_tickets` (1 artifact(s))
- `unsorted:artist_message` (1 artifact(s))
- `unsorted:artist_page` (6 artifact(s))
- `unsorted:band` (13 artifact(s))
- `unsorted:common` (9 artifact(s))
- `unsorted:defiant` (1 artifact(s))
- `unsorted:digital` (1 artifact(s))
- `unsorted:early_stages` (1 artifact(s))
- `unsorted:early_version` (1 artifact(s))
- `unsorted:event_listing` (1 artifact(s))
- `unsorted:fall_tour` (1 artifact(s))
- `unsorted:family` (1 artifact(s))
- `unsorted:fan` (4 artifact(s))
- `unsorted:fan_cover_song` (1 artifact(s))
- `unsorted:gear` (16 artifact(s))
- `unsorted:hacked_account` (1 artifact(s))
- `unsorted:indieartist` (2 artifact(s))
- `unsorted:instagram_hacked` (1 artifact(s))
- `unsorted:lancaster_pa` (1 artifact(s))
- `unsorted:live_show` (20 artifact(s))
- `unsorted:loss` (1 artifact(s))
- `unsorted:lyme_disease` (2 artifact(s))
- `unsorted:mental_health` (1 artifact(s))
- `unsorted:merch` (1 artifact(s))
- `unsorted:milestone` (3 artifact(s))
- `unsorted:music-video` (1 artifact(s))
- `unsorted:new_music` (7 artifact(s))
- `unsorted:new_song` (1 artifact(s))
- `unsorted:notable` (23 artifact(s))
- `unsorted:official` (1 artifact(s))
- `unsorted:personal` (13 artifact(s))
- `unsorted:pre_release` (5 artifact(s))
- `unsorted:promotional_post` (2 artifact(s))
- `unsorted:rare` (2 artifact(s))
- `unsorted:rehearsal` (1 artifact(s))
- `unsorted:released` (2 artifact(s))
- `unsorted:snarky` (1 artifact(s))
- `unsorted:social` (1 artifact(s))
- `unsorted:solo` (15 artifact(s))
- `unsorted:song_page` (6 artifact(s))
- `unsorted:songwriting` (1 artifact(s))
- `unsorted:songwriting_process` (1 artifact(s))
- `unsorted:ticketing` (1 artifact(s))
- `unsorted:tour` (4 artifact(s))
- `unsorted:tour_announcement` (4 artifact(s))
- `unsorted:tribute` (1 artifact(s))
- `unsorted:unique` (2 artifact(s))

## Per-artifact changes

### MV-20260419-003
- before: `["hunter_root", "rare", "run_with_the_hunt"]`
- after : `["people:hunter_root", "unsorted:rare", "album:run_with_the_hunt"]`

### MV-20260510-001
- before: `["2023", "arkansas", "defiant", "digital", "hunter_root", "music-video", "official", "reverend", "snarky", "video"]`
- after : `["year:2023", "album:arkansas", "unsorted:defiant", "unsorted:digital", "people:hunter_root", "unsorted:music-video", "unsorted:official", "song:reverend", "unsorted:snarky", "type:video"]`

### MV-HR-20260405-003
- before: `["artist_message", "hunter_root", "lyme_disease", "notable", "personal"]`
- after : `["unsorted:artist_message", "people:hunter_root", "unsorted:lyme_disease", "unsorted:notable", "unsorted:personal"]`

### MV-HR-20260405-004
- before: `["hunter_root", "new_music", "notable", "pre_release", "solo", "tour", "tour_announcement"]`
- after : `["people:hunter_root", "unsorted:new_music", "unsorted:notable", "unsorted:pre_release", "unsorted:solo", "unsorted:tour", "unsorted:tour_announcement"]`

### MV-HR-20260405-005
- before: `["early_version", "hunter_root", "new_music", "notable", "personal", "solo"]`
- after : `["unsorted:early_version", "people:hunter_root", "unsorted:new_music", "unsorted:notable", "unsorted:personal", "unsorted:solo"]`

### MV-HR-20260405-006
- before: `["fan", "hunter_root", "milestone", "new_music", "notable", "personal", "pre_release", "released"]`
- after : `["unsorted:fan", "people:hunter_root", "unsorted:milestone", "unsorted:new_music", "unsorted:notable", "unsorted:personal", "unsorted:pre_release", "unsorted:released"]`

### MV-HR-20260405-007
- before: `["gear", "hunter_root", "new_music", "notable", "rehearsal", "released", "solo"]`
- after : `["unsorted:gear", "people:hunter_root", "unsorted:new_music", "unsorted:notable", "unsorted:rehearsal", "unsorted:released", "unsorted:solo"]`

### MV-HR-20260405-008
- before: `["distrokid", "hunter_root", "new_music", "notable", "pre_release", "promotional_post", "solo", "tiktok"]`
- after : `["source:distrokid", "people:hunter_root", "unsorted:new_music", "unsorted:notable", "unsorted:pre_release", "unsorted:promotional_post", "unsorted:solo", "source:tiktok"]`

### MV-HR-20260405-009
- before: `["fan", "hunter_root", "lyme_disease", "notable", "personal", "tour_announcement"]`
- after : `["unsorted:fan", "people:hunter_root", "unsorted:lyme_disease", "unsorted:notable", "unsorted:personal", "unsorted:tour_announcement"]`

### MV-HR-20260405-010
- before: `["advance_tickets", "event_listing", "hunter_root", "lancaster_pa", "live_show", "medusas_disco", "notable", "solo", "ticketing", "tour", "tour_announcement"]`
- after : `["unsorted:advance_tickets", "unsorted:event_listing", "people:hunter_root", "unsorted:lancaster_pa", "unsorted:live_show", "album:medusas_disco", "unsorted:notable", "unsorted:solo", "unsorted:ticketing", "unsorted:tour", "unsorted:tour_announcement"]`

### MV-HR-20260405-011
- before: `["distrokid", "fan_cover_song", "hunter_root", "live_show", "notable", "personal", "promotional_post", "solo", "tiktok"]`
- after : `["source:distrokid", "unsorted:fan_cover_song", "people:hunter_root", "unsorted:live_show", "unsorted:notable", "unsorted:personal", "unsorted:promotional_post", "unsorted:solo", "source:tiktok"]`

### MV-HR-20260405-012
- before: `["hunter_root", "indieartist", "notable", "personal"]`
- after : `["people:hunter_root", "unsorted:indieartist", "unsorted:notable", "unsorted:personal"]`

### MV-HR-20260405-013
- before: `["family", "hunter_root", "indieartist", "loss", "nick_root", "personal", "rare", "tribute"]`
- after : `["unsorted:family", "people:hunter_root", "unsorted:indieartist", "unsorted:loss", "people:nick_root", "unsorted:personal", "unsorted:rare", "unsorted:tribute"]`

### MV-HR-20260405-014
- before: `["fall_tour", "fan", "hacked_account", "hunter_root", "instagram", "notable", "personal", "social"]`
- after : `["unsorted:fall_tour", "unsorted:fan", "unsorted:hacked_account", "people:hunter_root", "source:instagram", "unsorted:notable", "unsorted:personal", "unsorted:social"]`

### MV-HR-20260405-015
- before: `["early_stages", "hunter_root", "instagram_hacked", "mental_health", "new_song", "notable", "songwriting", "songwriting_process"]`
- after : `["unsorted:early_stages", "people:hunter_root", "unsorted:instagram_hacked", "unsorted:mental_health", "unsorted:new_song", "unsorted:notable", "unsorted:songwriting", "unsorted:songwriting_process"]`

### MV-HR-20260405-016
- before: `["band", "gear", "hunter_root", "live_show", "notable"]`
- after : `["unsorted:band", "unsorted:gear", "people:hunter_root", "unsorted:live_show", "unsorted:notable"]`

### MV-HR-20260405-017
- before: `["band", "gear", "hunter_root", "live_show", "notable"]`
- after : `["unsorted:band", "unsorted:gear", "people:hunter_root", "unsorted:live_show", "unsorted:notable"]`

### MV-HR-20260405-018
- before: `["band", "gear", "hunter_root", "live_show"]`
- after : `["unsorted:band", "unsorted:gear", "people:hunter_root", "unsorted:live_show"]`

### MV-HR-20260405-019
- before: `["band", "gear", "hunter_root", "live_show", "notable"]`
- after : `["unsorted:band", "unsorted:gear", "people:hunter_root", "unsorted:live_show", "unsorted:notable"]`

### MV-HR-20260405-020
- before: `["band", "common", "gear", "hunter_root", "live_show"]`
- after : `["unsorted:band", "unsorted:common", "unsorted:gear", "people:hunter_root", "unsorted:live_show"]`

### MV-HR-20260405-021
- before: `["band", "common", "gear", "hunter_root", "live_show"]`
- after : `["unsorted:band", "unsorted:common", "unsorted:gear", "people:hunter_root", "unsorted:live_show"]`

### MV-HR-20260405-022
- before: `["band", "gear", "hunter_root", "live_show", "notable"]`
- after : `["unsorted:band", "unsorted:gear", "people:hunter_root", "unsorted:live_show", "unsorted:notable"]`

### MV-HR-20260405-023
- before: `["band", "common", "gear", "hunter_root", "live_show"]`
- after : `["unsorted:band", "unsorted:common", "unsorted:gear", "people:hunter_root", "unsorted:live_show"]`

### MV-HR-20260405-024
- before: `["band", "gear", "hunter_root", "live_show", "notable"]`
- after : `["unsorted:band", "unsorted:gear", "people:hunter_root", "unsorted:live_show", "unsorted:notable"]`

### MV-HR-20260405-025
- before: `["common", "gear", "hunter_root", "live_show", "solo"]`
- after : `["unsorted:common", "unsorted:gear", "people:hunter_root", "unsorted:live_show", "unsorted:solo"]`

### MV-HR-20260405-026
- before: `["common", "gear", "hunter_root", "live_show", "solo"]`
- after : `["unsorted:common", "unsorted:gear", "people:hunter_root", "unsorted:live_show", "unsorted:solo"]`

### MV-HR-20260405-027
- before: `["common", "gear", "hunter_root", "live_show", "solo"]`
- after : `["unsorted:common", "unsorted:gear", "people:hunter_root", "unsorted:live_show", "unsorted:solo"]`

### MV-HR-20260405-028
- before: `["common", "gear", "hunter_root", "live_show", "solo"]`
- after : `["unsorted:common", "unsorted:gear", "people:hunter_root", "unsorted:live_show", "unsorted:solo"]`

### MV-HR-20260405-029
- before: `["common", "hunter_root"]`
- after : `["unsorted:common", "people:hunter_root"]`

### MV-HR-20260405-030
- before: `["band", "hunter_root", "live_show", "notable"]`
- after : `["unsorted:band", "people:hunter_root", "unsorted:live_show", "unsorted:notable"]`

### MV-HR-20260405-031
- before: `["band", "gear", "hunter_root", "live_show", "notable"]`
- after : `["unsorted:band", "unsorted:gear", "people:hunter_root", "unsorted:live_show", "unsorted:notable"]`

### MV-HR-20260405-032
- before: `["band", "gear", "hunter_root", "live_show", "notable"]`
- after : `["unsorted:band", "unsorted:gear", "people:hunter_root", "unsorted:live_show", "unsorted:notable"]`

### MV-HR-20260405-033
- before: `["common", "fan", "hunter_root", "live_show", "personal"]`
- after : `["unsorted:common", "unsorted:fan", "people:hunter_root", "unsorted:live_show", "unsorted:personal"]`

### MV-HR-20260405-034
- before: `["hunter_root", "milestone", "new_music", "notable", "personal", "pre_release", "solo"]`
- after : `["people:hunter_root", "unsorted:milestone", "unsorted:new_music", "unsorted:notable", "unsorted:personal", "unsorted:pre_release", "unsorted:solo"]`

### MV-HR-20260405-035
- before: `["hunter_root", "personal", "solo", "tour", "unique"]`
- after : `["people:hunter_root", "unsorted:personal", "unsorted:solo", "unsorted:tour", "unsorted:unique"]`

### MV-HR-20260405-036
- before: `["band", "hunter_root", "live_show", "notable", "poster"]`
- after : `["unsorted:band", "people:hunter_root", "unsorted:live_show", "unsorted:notable", "type:poster"]`

### MV-HR-20260405-037
- before: `["hunter_root", "new_music", "notable", "personal", "pre_release", "solo", "tour", "tour_announcement"]`
- after : `["people:hunter_root", "unsorted:new_music", "unsorted:notable", "unsorted:personal", "unsorted:pre_release", "unsorted:solo", "unsorted:tour", "unsorted:tour_announcement"]`

### MV-HR-20260405-038
- before: `["hunter_root", "merch", "milestone", "personal", "unique"]`
- after : `["people:hunter_root", "unsorted:merch", "unsorted:milestone", "unsorted:personal", "unsorted:unique"]`

### MV-HR-20260416-001
- before: `["artist_page", "hunter_root", "reverbnation", "solo"]`
- after : `["unsorted:artist_page", "people:hunter_root", "source:reverbnation", "unsorted:solo"]`

### MV-HR-20260416-002
- before: `["artist_page", "hunter_root", "reverbnation", "solo"]`
- after : `["unsorted:artist_page", "people:hunter_root", "source:reverbnation", "unsorted:solo"]`

### MV-HR-20260416-003
- before: `["artist_page", "hunter_root", "reverbnation", "medusas_disco"]`
- after : `["unsorted:artist_page", "people:hunter_root", "source:reverbnation", "album:medusas_disco"]`

### MV-HR-20260416-004
- before: `["artist_page", "hunter_root", "reverbnation", "medusas_disco"]`
- after : `["unsorted:artist_page", "people:hunter_root", "source:reverbnation", "album:medusas_disco"]`

### MV-HR-20260416-005
- before: `["hunter_root", "reverbnation", "song_page", "medusas_disco"]`
- after : `["people:hunter_root", "source:reverbnation", "unsorted:song_page", "album:medusas_disco"]`

### MV-HR-20260416-006
- before: `["hunter_root", "reverbnation", "song_page", "medusas_disco"]`
- after : `["people:hunter_root", "source:reverbnation", "unsorted:song_page", "album:medusas_disco"]`

### MV-HR-20260416-007
- before: `["hunter_root", "reverbnation", "song_page", "medusas_disco"]`
- after : `["people:hunter_root", "source:reverbnation", "unsorted:song_page", "album:medusas_disco"]`

### MV-HR-20260416-008
- before: `["audio", "hunter_root", "mp3", "reverbnation", "medusas_disco"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:medusas_disco"]`

### MV-HR-20260416-009
- before: `["artist_page", "hunter_root", "reverbnation", "run_with_the_hunt"]`
- after : `["unsorted:artist_page", "people:hunter_root", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260416-010
- before: `["artist_page", "hunter_root", "reverbnation", "run_with_the_hunt"]`
- after : `["unsorted:artist_page", "people:hunter_root", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260416-011
- before: `["hunter_root", "reverbnation", "song_page", "run_with_the_hunt"]`
- after : `["people:hunter_root", "source:reverbnation", "unsorted:song_page", "album:run_with_the_hunt"]`

### MV-HR-20260416-012
- before: `["hunter_root", "reverbnation", "song_page", "run_with_the_hunt"]`
- after : `["people:hunter_root", "source:reverbnation", "unsorted:song_page", "album:run_with_the_hunt"]`

### MV-HR-20260416-013
- before: `["hunter_root", "reverbnation", "song_page", "run_with_the_hunt"]`
- after : `["people:hunter_root", "source:reverbnation", "unsorted:song_page", "album:run_with_the_hunt"]`

### MV-HR-20260416-014
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-001
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-002
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-003
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-004
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-005
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-006
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-007
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-008
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-009
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-010
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-011
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-012
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-013
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-014
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-015
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-016
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-017
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-018
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-019
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-020
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-021
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-022
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-023
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-024
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-025
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260417-026
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260421-001
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

### MV-HR-20260421-002
- before: `["audio", "hunter_root", "mp3", "reverbnation", "run_with_the_hunt"]`
- after : `["type:audio", "people:hunter_root", "type:mp3", "source:reverbnation", "album:run_with_the_hunt"]`

