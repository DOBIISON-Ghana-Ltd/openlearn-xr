export interface LegalSection {
  title?: string
  paragraphs: string[]
  bullets?: string[]
}

export interface LegalContent {
  title: string
  lastUpdated: string
  intro: string[]
  sections: LegalSection[]
}

// ---------------------------------------------------------------------------
// Privacy Policy
// ---------------------------------------------------------------------------

export const PRIVACY_POLICY: LegalContent = {
  title: 'Privacy policy',
  lastUpdated: 'June 11, 2026',
  intro: [
    'This privacy notice for OpenLearn ("we," "us," or "our") describes how and why we might collect, store, use, and/or share ("process") your information when you use our services ("Services"), such as when you:',
  ],
  sections: [
    {
      paragraphs: [
        '• Visit our website at https://openlearn.app, or any website of ours that links to this privacy notice',
        '• Engage with us in other related ways, including any sales, marketing, or events',
      ],
    },
    {
      paragraphs: [
        'Questions or concerns? Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at privacy@openlearn.app.',
      ],
    },
    {
      title: '1. WHAT INFORMATION DO WE COLLECT?',
      paragraphs: [
        'In Short: We collect personal information that you provide to us.',
        'We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.',
        'Personal Information Provided by You. The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:',
      ],
      bullets: [
        'name',
        'email addresses',
        'billing addresses',
        'phone numbers',
        'institution or school name',
        'educator or student role',
      ],
    },
    {
      paragraphs: [
        'Sensitive Information. We do not process sensitive information. All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.',
      ],
    },
    {
      title: '2. HOW DO WE PROCESS YOUR INFORMATION?',
      paragraphs: [
        'In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.',
        'We process your personal information for a variety of reasons, depending on how you interact with our Services, including:',
      ],
      bullets: [
        'To facilitate account creation and authentication and otherwise manage user accounts.',
        'To deliver and facilitate delivery of services to the user.',
        'To send administrative information to you, including changes to our terms, conditions, and policies.',
        'To analyze usage data to understand which simulations are most effective for learners.',
        'To generate anonymized performance and grading reports for educators.',
        'To comply with legal obligations and respond to legal requests.',
      ],
    },
    {
      title: '3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?',
      paragraphs: [
        'In Short: We may share information in specific situations described in this section and/or with the following third parties.',
        'We may need to share your personal information in the following situations:',
      ],
      bullets: [
        'Business Transfers. We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.',
        'Analytics Providers. We may share information with analytics partners such as PostHog to help us understand usage patterns and improve the platform.',
      ],
    },
    {
      title: '4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?',
      paragraphs: [
        'In Short: We may use cookies and other tracking technologies to collect and store your information.',
        'We use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Upon your first visit, we display a cookie consent banner. If you click "Accept", optional analytics cookies are loaded. If you decline, only essential session cookies are used. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.',
      ],
    },
    {
      title: '5. HOW LONG DO WE KEEP YOUR INFORMATION?',
      paragraphs: [
        'In Short: We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.',
        'We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us to keep your personal information for longer than the period in which users have an account with us.',
      ],
    },
    {
      title: '6. HOW DO WE KEEP YOUR INFORMATION SAFE?',
      paragraphs: [
        'In Short: We aim to protect your personal information through a system of organizational and technical security measures.',
        'We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information.',
      ],
    },
    {
      title: '7. YOUR PRIVACY RIGHTS',
      paragraphs: [
        'In Short: You may review, change, or terminate your account at any time.',
        'Depending on your location, you may have certain rights regarding your personal information, including:',
      ],
      bullets: [
        'The right to request access and obtain a copy of your personal information.',
        'The right to request rectification or erasure of your personal information.',
        'The right to object to or restrict processing of your personal information.',
        'The right to data portability.',
        'The right to withdraw consent at any time.',
      ],
    },
    {
      title: '8. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?',
      paragraphs: [
        'If you have questions or comments about this notice, you may contact us at:',
        'OpenLearn\nprivacy@openlearn.app',
      ],
    },
  ],
}

// ---------------------------------------------------------------------------
// Terms of Service
// ---------------------------------------------------------------------------

export const TERMS_OF_SERVICE: LegalContent = {
  title: 'Terms of service',
  lastUpdated: 'June 11, 2026',
  intro: [
    'These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and OpenLearn ("we," "us," or "our"), concerning your access to and use of the OpenLearn platform and its Services.',
    'You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Terms of Service. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF SERVICE, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES.',
  ],
  sections: [
    {
      title: '1. OUR SERVICES',
      paragraphs: [
        'OpenLearn provides interactive 3D science simulation modules for educational institutions, students, and educators. The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation.',
        'The Services are not tailored to comply with industry-specific regulations in all jurisdictions. If your interactions would be subjected to such laws, you may not use the Services.',
      ],
    },
    {
      title: '2. INTELLECTUAL PROPERTY RIGHTS',
      paragraphs: [
        'Our Intellectual Property. We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the "Content").',
        'The Content and Marks are provided in or through the Services "AS IS" for your personal, non-commercial educational use or internal business purpose only. Except as set out in this section or elsewhere in our Terms, no part of the Services and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever.',
      ],
    },
    {
      title: '3. USER REPRESENTATIONS',
      paragraphs: [
        'By using the Services, you represent and warrant that:',
      ],
      bullets: [
        'All registration information you submit will be true, accurate, current, and complete.',
        'You will maintain the accuracy of such information and promptly update it as necessary.',
        'You have the legal capacity and you agree to comply with these Terms of Service.',
        'You will not access the Services through automated or non-human means, whether through a bot, script, or otherwise.',
        'You will not use the Services for any illegal or unauthorized purpose.',
        'Your use of the Services will not violate any applicable law or regulation.',
      ],
    },
    {
      title: '4. USER REGISTRATION',
      paragraphs: [
        'You may be required to register with the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.',
      ],
    },
    {
      title: '5. PROHIBITED ACTIVITIES',
      paragraphs: [
        'You may not access or use the Services for any purpose other than that for which we make the Services available. As a user of the Services, you agree not to:',
      ],
      bullets: [
        'Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.',
        'Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.',
        'Bypass, disable, or interfere with security-related features of the Services.',
        'Use the Services in a manner inconsistent with any applicable laws or regulations.',
        'Upload or transmit viruses or any other material that interferes with any party\'s uninterrupted use and enjoyment of the Services.',
        'Share your account credentials with other users.',
      ],
    },
    {
      title: '6. SERVICES MANAGEMENT',
      paragraphs: [
        'We reserve the right, but not the obligation, to:',
      ],
      bullets: [
        'Monitor the Services for violations of these Terms of Service.',
        'Take appropriate legal action against anyone who, in our sole discretion, violates the law or these Terms of Service.',
        'Refuse, restrict access to, limit the availability of, or disable (to the extent technologically feasible) any of your Contributions or any portion thereof.',
        'Remove from the Services or otherwise disable all files and content that are excessive in size or are in any way burdensome to our systems.',
        'Otherwise manage the Services in a manner designed to protect our rights and property.',
      ],
    },
    {
      title: '7. TERM AND TERMINATION',
      paragraphs: [
        'These Terms of Service shall remain in full force and effect while you use the Services. WITHOUT LIMITING ANY OTHER PROVISION OF THESE TERMS OF SERVICE, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES TO ANY PERSON FOR ANY REASON OR FOR NO REASON.',
        'If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party. In addition to terminating or suspending your account, we reserve the right to take appropriate legal action, including without limitation pursuing civil, criminal, and injunctive redress.',
      ],
    },
    {
      title: '8. GOVERNING LAW',
      paragraphs: [
        'These Terms shall be governed by and defined following the laws of the jurisdiction in which OpenLearn operates. OpenLearn and yourself irrevocably consent that the courts of that jurisdiction shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these Terms.',
      ],
    },
    {
      title: '9. CONTACT US',
      paragraphs: [
        'In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:',
        'OpenLearn\nlegal@openlearn.app',
      ],
    },
  ],
}

// ---------------------------------------------------------------------------
// Cookie Policy
// ---------------------------------------------------------------------------

export const COOKIE_POLICY: LegalContent = {
  title: 'Cookie policy',
  lastUpdated: 'June 11, 2026',
  intro: [
    'This Cookie Policy explains how OpenLearn ("we," "us," and "our") uses cookies and similar technologies to recognize you when you visit our platform at https://openlearn.app ("Website"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.',
    'In some cases we may use cookies to collect personal information, or that becomes personal information if we combine it with other information.',
  ],
  sections: [
    {
      title: '1. WHAT ARE COOKIES?',
      paragraphs: [
        'Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.',
        'Cookies set by the website owner (in this case, OpenLearn) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies." Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.',
      ],
    },
    {
      title: '2. WHY DO WE USE COOKIES?',
      paragraphs: [
        'We use first- and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Website for analytics and other purposes.',
      ],
    },
    {
      title: '3. TYPES OF COOKIES WE USE',
      paragraphs: [
        'The specific types of first- and third-party cookies served through our Website and the purposes they perform are described below:',
      ],
      bullets: [
        'Essential website cookies: These cookies are strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the Website to you, refusing them will have impact how our site functions.',
        'Session cookies: These are used by Better Auth to maintain your authenticated session. They are httpOnly and secure.',
        'Performance and functionality cookies: These cookies are used to enhance the performance and functionality of our Website but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.',
        'Analytics and customization cookies: These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you (e.g., PostHog).',
      ],
    },
    {
      title: '4. HOW CAN I CONTROL COOKIES?',
      paragraphs: [
        'You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Banner that appears when you first visit our platform.',
        'If you choose to reject cookies, you may still use our Website though your access to some functionality and areas may be restricted. You may also set or amend your web browser controls to accept or refuse cookies.',
        'The specific types of first- and third-party cookies served through our Website and the purposes they perform are described in the table above. You can opt-out of each cookie category (except strictly necessary cookies) by clicking on the "Decline" button in the cookie banner.',
      ],
    },
    {
      title: '5. HOW OFTEN WILL WE UPDATE THIS COOKIE POLICY?',
      paragraphs: [
        'We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.',
        'The date at the top of this Cookie Policy indicates when it was last updated.',
      ],
    },
    {
      title: '6. WHERE CAN I GET FURTHER INFORMATION?',
      paragraphs: [
        'If you have any questions about our use of cookies or other technologies, please contact us at:',
        'OpenLearn\nprivacy@openlearn.app',
      ],
    },
  ],
}
