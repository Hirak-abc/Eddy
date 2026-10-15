export interface DataDeletionSection {
  title: string;
  body: string;
}

export const DATA_DELETION_EFFECTIVE_DATE = 'October 15, 2026';

export const DATA_DELETION_CONTACT_EMAIL = 'thenightwingteam@gmail.com';

export const DATA_DELETION_MAILTO_SUBJECT = 'Eddy — Request to delete my data';

export const DATA_DELETION_MAILTO_BODY = `Hello Eddy team,

Please delete my Eddy account data.

Account email (Clerk login email):
Business name (if owner, optional):
I connected Instagram/Facebook to Eddy: Yes / No
I understand wallet coins and coupons may be forfeited on deletion: Yes

Additional details (optional):

Thank you.`;

export const DATA_DELETION_STATUS_URL_TEMPLATE =
  'https://eddy.example.com/api/social/data-deletion/status/CONFIRMATION_CODE';

// Content is the public instruction source for Meta App Review
// "Data Deletion Instructions URL" and in-app user requests.
export const DATA_DELETION_SECTIONS: DataDeletionSection[] = [
  {
    title: '1. What you can delete',
    body: 'You can request deletion of your Eddy account data, including your account profile, business profile(s) you own, uploaded images, flyers and marketing content you created, connected Instagram/Facebook account tokens and permissions, social publishing history and cached analytics, QR scans, rewards, wallet and transaction history, coupons, reviews, and support messages linked to your account.',
  },
  {
    title: '2. How to request deletion (pick any option)',
    body: 'Option A — In Eddy: go to Settings > Delete account / Request data deletion (Owner or Customer settings) and confirm. Option B — Email us at thenightwingteam@gmail.com from your login email with the subject “Eddy — Request to delete my data” and include your account email. Option C — Facebook/Instagram requested it: if you removed Eddy from Meta App Settings, Meta notifies us automatically and we process that callback the same way as an email request.',
  },
  {
    title: '3. If you connected Instagram or Facebook',
    body: 'Disconnecting inside Eddy (Owner > Social > Disconnect) immediately revokes our access tokens and stops future publishing and analytics sync. Removing Eddy via Facebook Settings > Apps and Websites, or Instagram Settings > Apps and Websites / Business tools, also revokes access. Either action alone does not delete historical Eddy data — submit a deletion request (above) if you also want stored data deleted.',
  },
  {
    title: '4. What happens after you request deletion',
    body: 'We verify you own the account (via your signed-in session or a reply to your login email), revoke Meta/Instagram/Facebook tokens, disconnect connected pages/accounts, delete or anonymize personal data in Convex, delete flyer/business images in Cloudflare R2, and remove AI prompts tied to your account. Wallet coins and unused coupons are forfeited and cannot be restored.',
  },
  {
    title: '5. Timeline',
    body: 'Acknowledgement within 7 days. Deletion or anonymization of personal and Meta-derived data within 30 days of verified request, subject to Section 6. Meta data-deletion callbacks receive a confirmation code and a status URL immediately per Meta platform requirements, and the underlying deletion completes within the same 30-day window.',
  },
  {
    title: '6. What we may retain',
    body: 'We may retain limited records where required: immutable wallet/reward transaction logs, coupon redemption records, payment/subscription verification records (Razorpay), and security/audit logs — kept in anonymized or minimum-necessary form for legal obligations, dispute resolution, fraud prevention, and enforcement of agreements. We never retain your Meta access tokens after deletion.',
  },
  {
    title: '7. Verification and questions',
    body: 'To protect your account, we only act on requests we can verify as coming from the account owner. If verification fails we will explain what additional proof is needed. For status updates or questions, email thenightwingteam@gmail.com with your confirmation code (if you received one) or account email.',
  },
];
