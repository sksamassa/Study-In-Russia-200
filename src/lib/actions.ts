"use server"

import { MultiPageFormData } from "./form-schemas";

export async function submitApplication(data: MultiPageFormData) {
  try {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error("Telegram bot token or chat ID is not set.");
      return { success: false, message: "Server configuration error: Telegram credentials missing." };
    }

    const message = `
New Student Application Submission:

*Personal Information:*
First Name: ${data.firstName}
Middle Name: ${data.middleName}
Last Name: ${data.lastName}
Citizenship: ${data.citizenship}
Date of Birth: ${data.dateOfBirth}

*Contact Information:*
Email: ${data.email}
Telegram/WhatsApp: ${data.telegramWhatsAppNumber}

*Education Program:*
Education Level: ${data.educationLevel}
General Field of Study: ${data.generalFieldOfStudy}
Field of Study: ${data.fieldOfStudy}

*Language Proficiency:*
${data.languages.map(lang => `  - ${lang.language}: ${lang.level}`).join('\n')}
Preparatory Course: ${data.preparatoryCourse ? "Yes" : "No"}

*Documents:*
Passport Files: ${data.passport.map(file => file.name).join(', ')}
Educational Degree Files: ${data.educationalDegree.map(file => file.name).join(', ')}
    `;

    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(telegramApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to send Telegram message:", errorData);
      return { success: false, message: `Failed to send application: ${errorData.description || response.statusText}` };
    }

    return { success: true, message: "Application submitted successfully!" };
  } catch (error) {
    console.error("Error submitting application:", error);
    return { success: false, message: "An unexpected error occurred during submission." };
  }
}
