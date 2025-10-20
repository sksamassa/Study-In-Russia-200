
"use server"

export async function submitApplication(data: any) {
  try {

    // Verify reCAPTCHA
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (recaptchaSecret) {
      const recaptchaResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${recaptchaSecret}&response=${data.recaptcha}`,
      });
      const recaptchaData = await recaptchaResponse.json();
      if (!recaptchaData.success) {
        return { success: false, message: "reCAPTCHA verification failed." };
      }
    } else {
      console.warn("RECAPTCHA_SECRET_KEY not set. Skipping reCAPTCHA verification.");
    }


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
${data.languages.map((lang: {language: string, level: string}) => `  - ${lang.language}: ${lang.level}`).join('\n')}
Preparatory Course: ${data.preparatoryCourse ? "Yes" : "No"}
    `;

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

    const passportFiles = data.passport as File[];
    const educationalDegreeFiles = data.educationalDegree as File[];
    
    const allFiles = [...passportFiles, ...educationalDegreeFiles];

    if (allFiles.length > 0) {
      const mediaFormData = new FormData();
      mediaFormData.append('chat_id', TELEGRAM_CHAT_ID);

      const mediaPayload = allFiles.map((file) => {
        mediaFormData.append(file.name, file);
        return {
          type: 'document',
          media: `attach://${file.name}`,
          caption: file.name
        };
      });

      // Telegram's sendMediaGroup has a limit of 10 items per request
      const mediaChunks = [];
      for (let i = 0; i < mediaPayload.length; i += 10) {
          mediaChunks.push(mediaPayload.slice(i, i + 10));
      }

      for (const chunk of mediaChunks) {
        const chunkFormData = new FormData();
        chunkFormData.append('chat_id', TELEGRAM_CHAT_ID);
        chunkFormData.append('media', JSON.stringify(chunk));

        allFiles.forEach(file => {
          if (chunk.some(media => `attach://${file.name}` === media.media)) {
            chunkFormData.append(file.name, file);
          }
        });

        const sendMediaUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMediaGroup`;
        const mediaResponse = await fetch(sendMediaUrl, {
            method: "POST",
            body: chunkFormData,
        });

        if (!mediaResponse.ok) {
            const errorData = await mediaResponse.json();
            console.error("Failed to send Telegram media:", errorData);
            return { success: false, message: `Failed to send application documents: ${errorData.description || mediaResponse.statusText}` };
        }
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
