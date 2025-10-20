# **App Name**: Study In Russia 200

## Core Features:

- Landing Page with Video Hero: Dynamic video background showcasing Russian universities, overlaid with key services and a clear CTA.
- Detailed Service Pages: Dedicated pages for each service (Study Invitation, Visa Support, Document Assistance, Airport Reception) outlining the process and benefits.
- Blog/News Section: Utilize Next.js SSG/ISR to create an SEO-optimized blog with articles and news related to studying in Russia.
- Student Application and Document Submission: Allow students to apply to different universities and upload the documents required for each university. A generative AI tool can verify uploaded documents for veracity, quality and readability. After that a tool decides if additional info needs to be extracted and uploaded to a Neon (Serverless Postgres) database for each application.
- Secure Student/Admin Dashboards: Individual dashboards for students and admins to manage applications, track progress, and communicate directly through the platform.
- Contact Section: Display contact info: Telegram (@studyinrussia200), WhatsApp (+79191267767), and Email (studyinrussia200@gmail.com).

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) evoking trust and stability, reflecting the seriousness of educational decisions.
- Background color: Light blue-gray (#ECEFF1), nearly white, creating a clean, uncluttered look.
- Accent color: Warm orange (#FF9800) used sparingly for calls to action and important notifications.
- Headline font: 'Playfair', a modern sans-serif, similar to Didot, geometric, high contrast thin-thick lines, with an elegant, fashionable, high-end feel. Body font: 'PT Sans', a humanist sans-serif for readability.
- Consistent use of simple, outlined icons from a library like Font Awesome or Material Icons, aligning with the modern aesthetic of Shadcn/UI.
- Grid-based layout with generous use of white space, ensuring a clear visual hierarchy and mobile responsiveness. Leverage Shadcn/UI's responsive components.
- Subtle animations for transitions and loading states to enhance user experience without being distracting.