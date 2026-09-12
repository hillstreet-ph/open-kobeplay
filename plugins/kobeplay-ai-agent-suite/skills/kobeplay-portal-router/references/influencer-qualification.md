# Influencer contract qualification

## Core formulas

- Platform minimum deposit: PHP 100.
- Register Quota = `ceil(Talent Fee / 100)`; reference KPI only.
- Qualified FTD Target = `ceil(Register Quota * 0.50)`.
- Total Deposit Quota = Talent Fee.
- Agency commission is excluded.

The influencer is eligible for human contract-extension or renewal review when either:

1. Actual Qualified FTD reaches the target; or
2. Actual Verified Total Deposits reaches the full Talent Fee.

Both passed = Strongly Qualified. FTD only = Qualified — FTD. Deposits only = Qualified — Deposits. Neither = Not Yet Qualified.

Total Deposits includes verified first deposits and redeposits. One player can create only one FTD. Count only settled, attributed, evidence-verified, fraud-cleared activity after the seven-day validation period.

Self-funded, related-party, duplicate, reversed, charged-back, misattributed, unverified, or coordinated hit-and-run activity contributes zero and is routed to Fraud Review. Store check results and safe evidence references, never raw KYC or payment credentials.

Qualification opens a review; it does not sign, pay, promise a price, or activate the next cycle. After human approval, create exactly one new contract cycle and fresh tasks; preserve the previous cycle and evidence.

Example: BUBBLES, Talent Fee PHP 6,000 → Register Quota 60, Qualified FTD Target 30, Total Deposit Quota PHP 6,000. Seventeen registers and five qualified FTDs still qualify by deposits if verified Total Deposits equal PHP 6,000.
