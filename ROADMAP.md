# Working Backwards — Roadmap to Launch

Decision (2026-06-27): **Ship the form-based experience as v1, launch to friends/family/beta,
then iterate.** Conversational experience is the flagship v2, not a launch blocker.

**Ethos (Marina, 2026-06-27): Progress over perfection. This idea has been waiting over a
year — it's time to drive toward launch.** Get it to a place she's proud of, but getting it
*out there* matters just as much. Claude's job is to keep pushing toward live.

**The bar for every decision:** does it make the obituary land *emotionally* and does it move
us toward launch? "Feels real" is the product; a generic obituary is the only failure that
makes everything else not matter. (See memory: working-backwards-north-star.)

Numbers in (#) map to Marina's original feedback list. Nothing from earlier versions was
dropped — items were reordered toward launch.

---

## ⭐ Priority order (Marina, 2026-06-27)

This is the order we drive in. The launch work below is sequenced to serve it.

1. **Powerful landing page** — copy that pulls people in + the animated creative intro. The front door.
2. **Sharing loop** — users share their result (growth) + (later) input from close people (realness).
3. **Get the questions right** — the soul of the product.
4. **Make the obit feel real.**
5. **Get people to dream** — the aspirational side genuinely lifting people into who they could become.

---

## Minimum Launch Bar (the finish line — cross it, don't gold-plate)

Launch is allowed once these are true. Everything else can be a fast-follow.

- [ ] Landing page copy is powerful enough that Marina is proud to send the link (v1 — words can keep improving after).
- [ ] The questions produce an obituary that feels *true*, not generic (the soul test — non-negotiable).
- [ ] Both obituaries (current + aspirational) read real on a quick gut-check with 1–2 trusted people.
- [ ] Users can **share their result** (link/image/text) — the cheap half of the sharing loop.
- [ ] Works on a phone (most shared links open on mobile).
- [ ] Deployed on a real domain with the API key server-side.
- [ ] Cost/abuse guardrail in place (rate limit + request size) so a public link can't drain the budget.
- [ ] Honest privacy line ("nothing is stored").

> Explicitly NOT required to launch: animated intro polish, gather-input-from-close-people,
> conversational mode, AI reminder system, one-question-at-a-time. All are post-launch.

---

## Phase 1 — Launch Drive (ordered by the priority list above)

### 1. Powerful landing page (#1, #1b)
- [x] **Animated creative intro (#1b)** — ⭐ Marina's idea. v1 BUILT (2026-06-28). Cinematic
      on-load sequence in `Welcome.jsx`: epigraph fades in → dissolves → "Working Backwards" →
      promise line revealed word-by-word → CTA "Write My Obituary". Auto-plays ~7s; "Skip"
      affordance; plays once then returning visitors get the end-state (localStorage
      `wb_intro_seen`); reduced-motion users get the static end-state. New `quoteout` keyframe
      in tailwind config.
- [x] **Landing copy v1 (#1)** — LOCKED with Marina:
      - Epigraph: *"Write your obituary — then figure out how to live up to it." — Warren Buffett*
        (verified-accurate trim of his real 2023 words; the snappy "work backwards" version is a
        popular paraphrase, NOT verbatim — avoided to protect the app's authenticity).
      - Promise line: **"How will you be remembered?"** (Marina's words).
      - **⭐ will/want motif:** landing asks how you *will* be remembered (current trajectory);
        aspirational intake later asks how you *want* to be (the choice). One word = the whole arc.
- [ ] **Open copy questions for Marina:** confirm the Buffett epigraph wording/attribution choice;
      optionally refine the promise line. Words can keep improving post-launch.

### 2. Sharing loop — cheap half now (#3, partial)
- [ ] **Share your result** — let users share their obituary + "what matters most" (shareable
      link, downloadable image/card, or copy-to-text). Light to build, real growth loop, in v1.
      *(The expensive half — texting close people for input — is the #1 fast-follow below.)*

### 3. Get the questions right (#2 content)
- [ ] **Revise the questions themselves** — not just copy, the actual questions. This is the
      soul. A question that yields a flat, could-be-anyone answer is a **P0 bug**. Claude drafts
      options, Marina decides the final set/wording.

### 4. Make the obit feel real (#5)
- [ ] **Deepen the obituary writing** — richer prompting, use the person's name/details,
      sensory specifics; possibly one tailored follow-up question to get better raw material.
      **A beta should not ship if the current-life obit still feels flat.** Pulled up from Phase 2.

### 5. Get people to dream (#6)
- [ ] **Aspirational question-page intro + framing** — help people genuinely dream into who
      they could become. Claude drafts options, Marina writes final words.
- [ ] **Current-obit reveal line (#4)** — e.g. "This is one ending. It does not have to be the
      one you keep." Claude drafts, Marina decides.

### Launch essentials (required, but kept lean)
- [ ] **Mobile-ready pass (#10)** — audit all 5 screens on a phone; tap targets, text sizes,
      spacing, actions row, share/print on iOS/Android.
- [ ] **Deploy (#10)** — one Render/Railway Node service: Express serves built `client/dist` +
      `/api`, key stays server-side, single URL. Buy a domain (~$10/yr). Alt: Vercel + serverless /api.
- [ ] **Cost & abuse guardrail** — rate limiting + request size limits before sharing widely.
- [ ] **Privacy note** — short honest line that nothing is stored server-side.

### Deferred out of the launch cut (was Phase 1, now post-launch — progress over perfection)
- [ ] **One question at a time (#2)** — Marina likes it, but it's a UX refinement, not a launch
      blocker. Moved to fast-follow.
- [ ] **Fix the dead pause after "Generate" (#8)** — Marina considers the wait minor. Not a
      priority; do not lead with it. Revisit only if beta testers complain.

---

## Phase 2 — First fast-follows (right after launch)

- [ ] **⭐ Sharing loop — expensive half (#3): text close people for input.** The bigger build:
      let users text friends/family a couple of questions; their answers make the obit feel more
      REAL (outside perspective) AND spread the app. Staged here because it's the most likely
      launch-delayer; ship it as the very first thing after going live.
- [ ] **One question at a time (#2)** — stepping stone toward conversational.
- [ ] **Next-step CTA — "so what do I do now?" (#9)** — hand the obit + "what matters most" to
      an AI that reminds you to live toward it. Define the next action after the reveal.
- [ ] **Start-over path + error handling on reveal screens** (from the earlier code review).
- [ ] **Animated intro — fuller cinematic version (#1b)** if the v1 left Marina wanting more.

---

## Phase 3 — Bigger bets (the vision)

- [ ] **Conversational experience (#7)** — multi-turn follow-ups ("I wish people saw me as
      creative" → "what ideas?"). The flagship v2.
- [ ] **AI reminder system (#9, full build)** — recurring nudges toward "what matters most."

---

## Beta essentials (slot where appropriate)
- [ ] Lightweight feedback capture from beta testers
- [ ] Light, privacy-respecting analytics (do people finish all 5 screens?)
