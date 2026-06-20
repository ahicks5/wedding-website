# Honeymoon Fund — Go-Live Checklist

Everything needed to move the honeymoon fund from **test mode** to **live (real money)**
once Stripe approves the account. Do the steps in order.

---

## Current status (as of 2026-06-20)

- **Site:** live on Vercel → https://www.lyndseyandandrew.com
- **Honeymoon page:** `/registry/honeymoon` — currently **hidden** behind an
  "Opening Soon" card on the Registry page, and `noindex` (kept out of Google).
  The page itself still works at that direct URL for testing.
- **Stripe:** account **in review (~2 days)**. Connected and working in **TEST mode**.
- **Supabase:** connected. Table `honeymoon_contributions` exists (migration `004` applied).
- **Webhook (TEST mode):** registered at `/api/honeymoon/webhook`, event `checkout.session.completed`.

> Key idea: **test mode and live mode are completely separate** in Stripe — different
> keys, different webhooks, different data. Going live = rebuilding the same two pieces
> (secret key + webhook) in the live world, then pointing Vercel at them.

---

## When Stripe approval comes through — do these in order

### 1. Get the LIVE secret key
1. https://dashboard.stripe.com → turn **OFF** the "Test mode" toggle (top-right) → now in **Live mode**.
2. **Developers → API keys** → copy the **Secret key** — it starts with **`sk_live_...`**.
   - ⚠️ If it starts with `sk_test_`, you're still in test mode. Flip the toggle.

### 2. Create the LIVE webhook
1. Still in **Live mode** → **Developers → Webhooks → Add endpoint**.
2. Endpoint URL: `https://www.lyndseyandandrew.com/api/honeymoon/webhook`
3. Event to send: **`checkout.session.completed`** (only that one).
4. Save → open the endpoint → reveal the **Signing secret** (`whsec_...`) → copy it.
   - ⚠️ This is a NEW secret, different from the test one. The test webhook will
     NOT fire for live payments.

### 3. Update Vercel env vars + redeploy
1. Vercel → project → **Settings → Environment Variables** (Production).
2. **Edit** these two to the live values:
   - `STRIPE_SECRET_KEY`   → the `sk_live_...` key (from step 1)
   - `STRIPE_WEBHOOK_SECRET` → the live `whsec_...` (from step 2)
3. **Redeploy:** Deployments → latest → ⋯ → **Redeploy**. (Env vars only take effect on a rebuild.)

### 4. Clear the test donations from the database
In Supabase → **SQL Editor**:
```sql
delete from honeymoon_contributions;
```
Verify it's empty:
```sql
select * from honeymoon_contributions;
```
So every bar starts at $0 for real guests.

### 5. Reveal the fund on the Registry page
In `src/app/registry/RegistryContent.tsx`, the `Honeymoon Fund` entry:
- remove `comingSoon: true`
- add `internal: true`
- set `description: "Help send us off to Italy."`

(Or just ask Claude: "reveal the honeymoon fund on the registry.") Then commit + push.

### 6. Real end-to-end test (then refund)
1. Visit `/registry/honeymoon` and contribute a **small real amount ($1–2)** with a real card.
2. Confirm: a row appears in Supabase, the bar moves, and the payment shows in your
   Stripe **Balance/Payments**.
3. **Refund** it: Stripe → Payments → that payment → **Refund**.
   (Stripe's per-transaction fee isn't returned on refunds — negligible on $1–2.)
4. Clear the test row again: `delete from honeymoon_contributions;`

✅ Done — real guests can now give.

---

## Reference

- **Experiences & prices** live in code at `src/lib/honeymoon.ts`:
  - `general-fund` — first, **no goal / no dollar metric shown**
  - `mallorca-massage` — $300
  - `florence-wine-tasting` — $200
  - `vatican-tour` — $200
  - (Editing this file is the only place to change titles, blurbs, prices, order.)
- **Live totals (handy for debugging):** https://www.lyndseyandandrew.com/api/honeymoon/totals
  — returns JSON of dollars raised per experience, straight from the live DB.
- **Test card (TEST mode only):** `4242 4242 4242 4242`, any future expiry, any CVC/ZIP.
- **Money flow:** card → your **Stripe balance** → automatic payout to your linked
  **bank account** (rolling, ~2 business days). Stripe fee ≈ **2.9% + $0.30** per gift.
- **Taxes:** as an Individual collecting gifts, Stripe may issue a **1099-K** if yearly
  totals cross IRS thresholds. Heads-up only.
- **Caching fix:** `src/lib/supabase.ts` forces reads to `cache: "no-store"` so totals
  never go stale. Keep it — removing it brings back the "donation doesn't show up" bug.

## Troubleshooting
- **Bars not updating:** hit the totals URL above directly. If it's correct there, it's
  just a browser cache — the page also auto-refreshes every 15s.
- **Live payment didn't record:** Stripe → Webhooks → the **live** endpoint → event log;
  look for non-200 responses. Confirm `STRIPE_WEBHOOK_SECRET` is the LIVE one and you redeployed.
- **Guest sees a test-looking checkout:** Vercel still has the `sk_test_` key, or you
  didn't redeploy after editing env vars.
