# The queue proven through Buffer, as drafts — 2026-09-18

Ops row `buffer-proof`. No ruling was needed. Nothing was scheduled and nothing is public.

## What was done

1. `tools/reels-queue.mjs` was read against Buffer's API as it answers today (its own schema, asked of `api.buffer.com` with the key; the key was never printed).
2. The tool was corrected where the API had moved (below).
3. The 10-31 stand-in Q&A reel ("Is it too late to start over?") went through the whole line: the file to the museum's R2 bucket, then `createPost` on each connected channel with `saveToDraft: true`.
4. Buffer was asked what it holds (`node tools/reels-queue.mjs --posts`). It answered: three drafts.

| channel | Buffer post id | status | due |
|---|---|---|---|
| tiktok | 6aadc14b560f708e81463af6 | draft | 2026-10-31 17:00 New York (21:00 UTC) |
| instagram | 6aadc14ba4c300df32a092f9 | draft | 2026-10-31 17:00 New York |
| youtube | 6aadc15d5fe629aa26636407 | draft | 2026-10-31 17:00 New York |

A draft, in Buffer's own words, "will not be published until explicitly scheduled". The three drafts cannot post on their own.

## What the tool would have done without the reading

Every live send would have failed. Found and fixed:

- `needsApproval` is a required field now. The tool did not send it.
- Instagram requires `shouldShareToFeed` beside `type`. The tool sent only `type`.
- YouTube requires a `title`, and refuses a post without a `categoryId` although the schema calls it optional. The tool sent neither. Now: the question (or song and piece) as the title, cut at 100 characters; category 24 Entertainment, 10 Music for the Number (Ops' call).
- The reply was read through an error type, `MutationError`, that Buffer no longer has; the whole mutation was refused as malformed. The tool now names the six error types the reply can be and prints which one came back.
- `--schema` asked for `PostMetadataInput`; the type is `PostInputMetaData`. It now prints every input it depends on and says so when a name is gone.

## What the tool does now that it did not

- `--draft`: the send is saved as a draft. The row stays `built`; only a post Buffer holds as `scheduled` makes a row `queued`.
- A `test` row reaches Buffer as a draft or not at all. `--test` without `--draft` is refused. A stand-in cannot be scheduled by this tool.
- A second run doubles nothing: a channel that already holds the row is left alone, and the row keeps its first upload. Proven by running it twice.
- A proof draft does not stand in the way of the real send: a run without `--draft` ignores draft postings on the row.
- `--posts`: what Buffer holds that is not yet sent, read back from Buffer.

## What is not proven

That a scheduled post publishes. It cannot be proven before the door without posting, and nothing posts before the door. The first scheduled send is the first real Q&A row; the only difference in the request is `saveToDraft: false`, and Buffer then checks the free plan's limit (10 scheduled posts a channel).

## Left behind

- Nothing in Buffer. The three drafts were removed the same evening on Mike's word ("Remove the three drafts") with `--remove-drafts`, which asks Buffer what each post is and removes only a draft; `--posts` then read 0 held.
- The stand-in reel is at an unlisted address on `assets.weird.baby/reels/qa/2026-10-31/…` (one copy, named by the row's `asset_url`; the later runs uploaded nothing, checked). Nothing links to it.
- The morning run (`--lane qa --ahead 7`, no `--test`) now has a key. It queues nothing until a real built row falls inside its seven days; the first such day is 10-24.

## Also fixed on the way

`tools/morning.mjs` typed the door as 10-30. It now reads `DOOR_DAY` from `record-epoch.js`, the date's one home.
