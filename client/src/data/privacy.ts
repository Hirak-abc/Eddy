export interface PrivacySection {
  title: string;
  body: string;
}

export const PRIVACY_EFFECTIVE_DATE = 'September 27, 2026';

// Content mirrors docs/PrivacyPolicy.tsx, which remains the legal source draft.
export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    title: '1. Information We Collect',
    body: 'Eddy may collect information you provide when you create an account, create or manage a business profile, use customer features, generate marketing content, connect social accounts, make payments, or contact us. Depending on how you use Eddy, this may include account information, business information, uploaded images, marketing content, social account information, reward and wallet activity, coupon activity, reviews, subscription information, and information about your use of the Eddy platform.',
  },
  {
    title: '2. How We Use Information',
    body: 'We use information to provide and operate Eddy’s features; create and personalize flyers, hashtags, offers, and marketing content; connect and publish content to supported social accounts; provide QR, rewards, wallet, coupon, and customer engagement features; process subscriptions and payments; provide analytics and improve the Eddy experience; protect the platform and prevent misuse; and communicate important service updates.',
  },
  {
    title: '3. AI-Powered Features',
    body: 'Eddy uses Grok / xAI services for AI-powered flyer and hashtag generation. Information needed to generate requested content may be processed by the relevant AI service. Eddy should not send unnecessary personal or sensitive information to an AI provider when it is not required for the requested feature.',
  },
  {
    title: '4. Social Media Integrations',
    body: 'Eddy may connect with supported Meta services, including Instagram and Facebook, to publish content and retrieve supported social media analytics. Information available to Eddy depends on the permissions granted by the user and the capabilities and policies of the relevant platform.',
  },
  {
    title: '5. Payments and Subscriptions',
    body: 'Eddy uses Razorpay for subscription payment processing. Payment information may be processed by Razorpay according to its own privacy practices and terms. Eddy does not intend to store sensitive payment credentials such as card numbers when those credentials are handled directly by the payment provider.',
  },
  {
    title: '6. Images and Uploaded Content',
    body: 'Business images and generated flyer/image assets may be stored using Cloudflare R2. Users should only upload content that they have the right to use and should avoid uploading unnecessary sensitive personal information.',
  },
  {
    title: '7. Authentication',
    body: 'Eddy uses Clerk for authentication and account identity services. Authentication-related information is processed as necessary to securely create accounts, maintain sessions, and authenticate users.',
  },
  {
    title: '8. Product Analytics',
    body: 'Eddy uses Google Analytics 4 for product usage analytics. This may include information about interactions with the Eddy website or application, such as feature usage and events. Analytics data is used to understand product usage and improve the service.',
  },
  {
    title: '9. Data Storage',
    body: 'Eddy uses Convex for application data and persistent application state. Cloudflare R2 is used for large binary assets such as images and generated flyers. Different service providers may therefore process different categories of information on Eddy’s behalf.',
  },
  {
    title: '10. Data Sharing',
    body: 'Eddy may share or make information available to service providers necessary to operate the platform, including authentication, AI, social media, payment, storage, and analytics providers. Eddy may also disclose information when required by applicable law, legal process, or to protect the rights, security, and integrity of Eddy, its users, or others.',
  },
  {
    title: '11. Customer and Business Interactions',
    body: 'Eddy may process information generated through business-customer interactions, including QR scans, rewards, coupons, wallet transactions, reviews, and related activity. These records are used to provide the corresponding features and maintain accurate transaction and reward state.',
  },
  {
    title: '12. Security',
    body: 'Eddy is designed to keep authentication, authorization, reward, transaction, and other security-sensitive operations under server-side control. Access to protected features is subject to authentication and authorization controls. However, no online service can guarantee absolute security.',
  },
  {
    title: '13. Data Retention',
    body: 'Eddy retains information for as long as reasonably necessary to provide requested services, maintain account and transaction records, comply with legal obligations, resolve disputes, and enforce agreements. Specific retention periods may vary depending on the type of information and applicable requirements.',
  },
  {
    title: '14. Your Choices and Rights',
    body: 'Depending on your location and applicable law, you may have rights relating to your personal information, such as requesting access, correction, deletion, or other applicable rights. You may also be able to disconnect supported third-party accounts or stop using particular Eddy features. Requests can be made through the contact method provided by Eddy.',
  },
  {
    title: '15. Children’s Privacy',
    body: 'Eddy is intended for business owners and customers using the service for its intended purposes. Eddy does not knowingly seek to collect personal information from children where such collection is prohibited by applicable law.',
  },
  {
    title: '16. Third-Party Services',
    body: 'Eddy integrates with third-party services including Clerk, xAI, Meta, Razorpay, Cloudflare, and Google Analytics. Those services may have their own privacy policies and terms. Users should review the relevant third-party policies when using integrations that involve their accounts or information.',
  },
  {
    title: '17. Changes to This Privacy Policy',
    body: 'Eddy may update this Privacy Policy when the service, integrations, legal requirements, or data practices change. The updated version will be made available through Eddy, and the effective date will be updated when appropriate.',
  },
  {
    title: '18. Contact',
    body: 'If you have questions, requests, or concerns about this Privacy Policy or Eddy’s handling of information, contact the Eddy team through the official support/contact channel provided by the service.',
  },
];
