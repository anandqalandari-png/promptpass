# Stripe Setup — PromptPass

Follow these steps to create one Payment Link per department.

---

## 1. Create your account

Go to [https://stripe.com](https://stripe.com) → **Start now** → sign up free.  
You can use **Test mode** first (toggle top-left) — switch to Live when ready to charge real money.

---

## 2. Create a Payment Link for each department

For each department below, do the following:

- Go to **Payment Links** (in the left sidebar) → **+ New**
- Under **Products** → **+ Add a product**
  - Name: `PromptPass — [DEPARTMENT NAME]` (see table below)
  - Price: `€2.50` — one time
- Under **After payment** → set **Redirect URL** to:
  ```
  https://promptpass.vercel.app/success?department=DEPARTMENT_ID
  ```
  Replace `DEPARTMENT_ID` with the exact ID from the table below.
- Click **Create link**
- Copy the generated URL (looks like `https://buy.stripe.com/xxxxxxxx`)

---

## 3. Department table

| Department Name | DEPARTMENT_ID to use in redirect URL |
|---|---|
| Investment Banking & M&A | `investment-banking` |
| Private Equity & Venture Capital | `private-equity` |
| Asset Management | `asset-management` |
| Financial Markets & Trading | `financial-markets` |
| Strategy Consulting | `strategy-consulting` |
| Corporate Strategy & Chief of Staff | `corporate-strategy` |
| Marketing & Brand Management | `marketing-brand` |
| ESG & Sustainability | `esg-sustainability` |
| Product Management | `product-management` |
| Project Management (Media, Sports & Events) | `project-management` |
| Communications & PR | `communications` |
| Luxury & Premium Goods | `luxury` |

---

## 4. Fill in the Stripe links

Once you have all 12 Payment Link URLs, open:

```
src/data/stripe_links.ts
```

And paste each URL next to the correct department ID.

---

## 5. Confirm

Once all 12 links are created and pasted into `stripe_links.ts`:

**Reply "Stripe done" and we will move to Step 4.**
