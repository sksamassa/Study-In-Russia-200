
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
    `;

    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('caption', message);
    formData.append('parse_mode', 'Markdown');

    const media: any[] = [];

    for (const file of data.passport) {
        const response = await fetch(file.url);
        const blob = await response.blob();
        formData.append(file.name, blob, file.name);
        media.push({ type: 'document', media: `attach://${file.name}`, caption: `Passport: ${file.name}` });
    }

    for (const file of data.educationalDegree) {
        const response = await fetch(file.url);
        const blob = await response.blob();
        formData.append(file.name, blob, file.name);
        media.push({ type: 'document', media: `attach://${file.name}`, caption: `Educational Degree: ${file.name}` });
    }

    // Send the text message first
    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const textResponse = await fetch(telegramApiUrl, {
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

    if (!textResponse.ok) {
        const errorData = await textResponse.json();
        console.error("Failed to send Telegram message:", errorData);
        return { success: false, message: `Failed to send application text: ${errorData.description || textResponse.statusText}` };
    }


    // Then send the documents
    if (media.length > 0) {
        const mediaFormData = new FormData();
        mediaFormData.append('chat_id', TELEGRAM_CHAT_ID);

        const filesToAttach: { [key: string]: Blob } = {};
        
        const mediaPayload = await Promise.all(
            [...data.passport, ...data.educationalDegree].map(async (file, index) => {
                const response = await fetch(file.url);
                const blob = await response.blob();
                const attachmentName = `file${index}`;
                mediaFormData.append(attachmentName, blob, file.name);
                return {
                    type: 'document',
                    media: `attach://${attachmentName}`,
                    caption: file.name
                };
            })
        );

        mediaFormData.append('media', JSON.stringify(mediaPayload));
        
        const sendMediaUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMediaGroup`;
        const mediaResponse = await fetch(sendMediaUrl, {
            method: "POST",
            body: mediaFormData,
        });

        if (!mediaResponse.ok) {
            const errorData = await mediaResponse.json();
            console.error("Failed to send Telegram media:", errorData);
            return { success: false, message: `Failed to send application documents: ${errorData.description || mediaResponse.statusText}` };
        }
    }

    return { success: true, message: "Application submitted successfully!" };
  } catch (error) {
    console.error("Error submitting application:", error);
    if (error instanceof Error) {
        return { success: false, message: `An unexpected error occurred during submission: ${error.message}` };
    }
    return { success: false, message: "An unexpected error occurred during submission." };
  }
}
