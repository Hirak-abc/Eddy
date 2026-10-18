export interface TermsSection {
  title: string;
  body: string;
}

export const TERMS_EFFECTIVE_DATE = 'October 14, 2026';

// Draft content only. This should be reviewed and finalized for Eddy’s legal
// entity, jurisdiction, and actual business practices before being published
// as the official legal terms.
export const TERMS_SECTIONS: TermsSection[] = [
  {
    title: '1. About Eddy',
    body: 'Eddy is a SaaS platform for small and medium businesses combining AI flyer generation, trend-based marketing, AI hashtags, Instagram/Facebook publishing and analytics, customer rewards and spin wheels, QR interactions, wallets and coins, flyer coupons, reviews, subscriptions, and owner analytics. By accessing or using Eddy, you agree to these Terms of Service.',
  },
  {
    title: '2. Accounts and Roles',
    body: 'Eddy uses Clerk for authentication. You must provide accurate account information and keep your credentials secure. Eddy supports OWNER, CUSTOMER, and ADMIN roles. Owners manage businesses, customers earn rewards, and access to protected features is subject to authentication and authorization controls enforced by the backend.',
  },
  {
    title: '3. Business Owner Responsibilities',
    body: 'Business owners are responsible for the accuracy of their business profile, uploaded images, flyers, offers, coupon codes, and published content. Owners must only upload content they have the right to use and must not publish misleading, unlawful, or infringing material. Owners approve or reject customer wallet redemption requests in a timely and fair manner.',
  },
  {
    title: '4. Customer Responsibilities',
    body: 'Customers must use QR scans, rewards, spin wheels, wallets, coupons, and reviews honestly. Any attempt to manipulate scans, redemptions, streaks, or reviews — including fake accounts, repeated abuse, or misuse of another customer’s rewards — may result in forfeiture of coins or suspension of the account.',
  },
  {
    title: '5. Wallet and Coins',
    body: 'Wallet balances and coin operations are controlled and recorded server-side and are final. The current program rules are 1 coin = ₹1, a minimum redemption of 50 coins, and a maximum wallet balance of 100 coins. Coins have no cash value outside Eddy, cannot be transferred between customers, and may expire or be adjusted to correct errors, fraud, or misuse.',
  },
  {
    title: '6. QR Scans and Streaks',
    body: 'QR codes identify participating businesses and contain no sensitive credentials. QR scans are limited to 100 scans per customer per day, enforced server-side. Streaks are calculated server-side; current milestones grant +10 coins at 10, 20, and 30 days, and three consecutive inactive days reset the streak. Eddy may update these limits and milestones with notice through the service.',
  },
  {
    title: '7. Coupons',
    body: 'Flyer coupons are one-time use with a current validity of 96 hours from issuance unless stated otherwise. Coupon redemption verifies existence, business ownership, expiry, usage status, and customer eligibility. Expired, already-used, or ineligible coupons will be rejected, and Eddy is not obligated to reissue them.',
  },
  {
    title: '8. AI-Generated Content',
    body: 'Eddy uses Grok / xAI services for AI flyer and hashtag generation. AI-generated content is provided as-is and owners should review flyers, hashtags, and offers before publishing. Eddy does not guarantee the accuracy, originality, or availability of AI-generated content, and owners remain responsible for what they publish.',
  },
  {
    title: '9. Social Publishing and Analytics',
    body: 'Publishing to Instagram and Facebook and retrieving social analytics depend on Meta Graph API permissions granted by the user and the capabilities and policies of those platforms. Scheduled or automatic publishing may fail or be delayed because of platform restrictions, revoked permissions, or outages, and Eddy is not liable for resulting delays or missed publications.',
  },
  {
    title: '10. Subscriptions and Payments',
    body: 'Paid subscriptions are processed through Razorpay, which is authoritative for payment verification. Subscriptions are not activated on the basis of a frontend success message alone; activation requires server-side verification of the payment or webhook. Current pricing is shown in the service (₹299 subscription tier) and may change with notice. Unless required by applicable law, payments are non-refundable once the subscription period has started.',
  },
  {
    title: '11. Reviews',
    body: 'Reviews must reflect genuine customer experiences. Fake, incentivized-misleading, defamatory, or unlawful reviews are prohibited. Eddy may moderate, hide, or remove reviews that violate these terms or applicable law.',
  },
  {
    title: '12. Acceptable Use',
    body: 'You agree not to misuse Eddy, including attempting unauthorized access, interfering with the service, uploading malicious content, infringing intellectual property, scraping or reverse-engineering the platform, or using Eddy for unlawful purposes. Business logic and authorization are enforced server-side, and attempts to bypass them are violations of these terms.',
  },
  {
    title: '13. Intellectual Property',
    body: 'Eddy, its branding, software, and platform content remain the property of Eddy and its licensors. You retain rights in content you upload, and you grant Eddy a license to store, process, display, and publish that content as necessary to operate the features you use, including flyer generation, social publishing, and shop pages.',
  },
  {
    title: '14. Service Availability',
    body: 'Eddy is provided on an “as is” and “as available” basis. Eddy does not guarantee uninterrupted, error-free, or specific-outcome service, including AI generation quality, trend discovery, publishing timing, analytics accuracy, or reward availability. Eddy may modify, suspend, or discontinue features with reasonable notice through the service.',
  },
  {
    title: '15. Limitation of Liability',
    body: 'To the maximum extent permitted by applicable law, Eddy is not liable for indirect, incidental, special, consequential, or punitive damages, or for loss of profits, revenue, data, or goodwill arising from use of the service. Eddy’s total liability for any claim relating to the service is limited to the amounts paid by you to Eddy in the twelve months preceding the claim, or the minimum amount permitted by law.',
  },
  {
    title: '16. Termination',
    body: 'You may stop using Eddy at any time. Eddy may suspend or terminate accounts or access for violations of these terms, fraud, misuse of rewards or payments, or legal requirements. On termination, access to paid features ends at the close of the current subscription period unless stated otherwise, and unused coins or coupons may be forfeited.',
  },
  {
    title: '17. Changes to These Terms',
    body: 'Eddy may update these Terms of Service when the service, integrations, pricing, legal requirements, or business practices change. The updated version will be made available through Eddy with an updated effective date. Continued use of Eddy after the changes take effect constitutes acceptance of the updated terms.',
  },
  {
    title: '18. Contact',
    body: 'If you have questions about these Terms of Service, contact the Eddy team at thenightwingteam@gmail.com.',
  },
];
