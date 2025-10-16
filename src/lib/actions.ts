
"use server"

import { documentVeracityCheck, type DocumentVeracityCheckOutput } from "@/ai/flows/document-veracity-check"
import { extractAdditionalInfo } from "@/ai/flows/additional-info-extraction"
import { z } from "zod"
import { universityRequirements } from "@/lib/university-data"
import getConfig from "next/config"
import "server-only"

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"]

const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, "File is required.")
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    `Max file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
  )
  .refine(
    (file) => ACCEPTED_FILE_TYPES.includes(file.type),
    "Invalid file type. Only JPG, PNG, and PDF are allowed."
  )

const applicationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  citizenship: z.string().min(1, "Citizenship is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  passport: fileSchema,
  education: z.array(fileSchema).min(1, "At least one educational document is required."),
})


export interface ApplicationState {
  status: "idle" | "loading" | "success" | "error"
  message: string | null
  data?: {
    veracity: {
      isAuthentic: boolean
      isReadable: boolean
      meetsRequirements: boolean
      errors: string | null
    }
    extraction?: Record<string, string | number | boolean | null>
  } | null
  errors?: {
    firstName?: string[]
    middleName?: string[]
    lastName?: string[]
    citizenship?: string[]
    email?: string[]
    phone?: string[]
    passport?: string[]
    education?: string[]
  } | null
}


// --- Notification Helpers (fire-and-forget) ---
async function sendTelegramMessage(message: string) {
  const botToken = serverRuntimeConfig.TELEGRAM_BOT_TOKEN
  const chatId = serverRuntimeConfig.TELEGRAM_CHAT_ID

  if (!botToken) {
    console.warn("⚠️  TELEGRAM_BOT_TOKEN not set. Skipping Telegram notification.")
    console.log("--- Application Data (Telegram disabled) ---")
    console.log(message)
    console.log("------------------------------------------")
    return
  }

  if (!chatId) {
    console.warn("⚠️  TELEGRAM_CHAT_ID not set. Skipping Telegram notification.")
    console.log("\n📋 TO ENABLE TELEGRAM NOTIFICATIONS:")
    console.log("1. Open Telegram and start a chat with your bot")
    console.log("2. Send any message to the bot (e.g., '/start')")
    console.log(`3. Visit: https://api.telegram.org/bot${botToken}/getUpdates`)
    console.log("4. Look for the 'chat' object in the response")
    console.log("5. Copy the 'id' value (it will be a number like 123456789)")
    console.log("6. Add TELEGRAM_CHAT_ID to your environment variables with that number")
    console.log("\n--- Application Data (Telegram disabled) ---")
    console.log(message)
    console.log("------------------------------------------\n")
    return
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      if (result.description?.includes("chat not found")) {
        console.error("❌ Telegram Error: Chat not found")
        console.log("\n📋 YOUR CHAT ID IS INCORRECT OR THE BOT HASN'T BEEN STARTED:")
        console.log("1. Make sure you've sent a message to your bot first")
        console.log(`2. Get your correct chat ID from: https://api.telegram.org/bot${botToken}/getUpdates`)
        console.log(`3. Current TELEGRAM_CHAT_ID value: ${chatId}`)
        console.log("4. Update the TELEGRAM_CHAT_ID environment variable with the correct ID\n")
      } else {
        console.error("❌ Telegram API error:", result)
      }
      console.log("--- Application Data (Telegram failed) ---")
      console.log(message)
      console.log("------------------------------------------")
    } else {
      console.log("✅ Telegram message sent successfully to chat ID:", chatId)
    }
  } catch (error) {
    console.error("❌ Failed to send Telegram message:", error)
    console.log("--- Application Data (Telegram failed) ---")
    console.log(message)
    console.log("------------------------------------------")
  }
}

async function sendEmail(subject: string, htmlBody: string) {
  try {
    const appUrl = publicRuntimeConfig.NEXT_PUBLIC_APP_URL || "http://localhost:9002";
    const response = await fetch(`${appUrl}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "studyinrussia200@gmail.com",
        subject,
        html: htmlBody,
      }),
    })

    if (!response.ok) {
      console.error("Email API error:", await response.text())
      console.log("--- Failed to send email, logging instead ---")
      console.log(`Subject: ${subject}`)
      console.log(htmlBody)
    } else {
      console.log("✅ Email sent successfully to studyinrussia200@gmail.com")
    }
  } catch (error) {
    console.error("Failed to send email:", error)
    console.log("--- Email send failed, logging instead ---")
    console.log(`Subject: ${subject}`)
    console.log(htmlBody)
  }
}

type NotificationData = {
  firstName: string
  middleName?: string
  lastName: string
  citizenship: string
  email: string
  phone: string
  passport: string
  education: string[]
}

function formatApplicationForNotification(
  applicationData: NotificationData,
  veracityResult: ApplicationState["data"]["veracity"],
  extractionResult: Record<string, any> | undefined,
) {
  const verificationText = `
<b>AI Verification:</b>
- Authentic: ${veracityResult.isAuthentic ? "✅" : "❌"}
- Readable: ${veracityResult.isReadable ? "✅" : "❌"}
- Meets Requirements: ${veracityResult.meetsRequirements ? "✅" : "❌"}
- Errors: ${veracityResult.errors || "None"}`

  const extractionText = extractionResult ? `

<b>AI Extracted Info:</b>
<code>${JSON.stringify(extractionResult, null, 2)}</code>` : ""

  const text = `<b>New University Application:</b>

<b>Personal Info:</b>
- Name: ${applicationData.firstName} ${applicationData.middleName || ""} ${applicationData.lastName}
- Citizenship: ${applicationData.citizenship}
- Email: ${applicationData.email}
- Phone: ${applicationData.phone}

<b>Documents:</b>
- Passport: ${applicationData.passport}
- Education Docs: ${applicationData.education.join(", ")}
${verificationText}
${extractionText}
`

  const html = `
<html>
<body>
    <h1>New University Application</h1>
    <h2>Personal Information</h2>
    <ul>
        <li><strong>Name:</strong> ${applicationData.firstName} ${applicationData.middleName || ""} ${applicationData.lastName}</li>
        <li><strong>Citizenship:</strong> ${applicationData.citizenship}</li>
        <li><strong>Email:</strong> ${applicationData.email}</li>
        <li><strong>Phone:</strong> ${applicationData.phone}</li>
    </ul>
    <h2>Documents Submitted</h2>
    <ul>
        <li><strong>Passport:</strong> ${applicationData.passport}</li>
        <li><strong>Education Docs:</strong> ${applicationData.education.join(", ")}</li>
    </ul>
    <h2>AI Verification Results</h2>
    <ul>
        <li><strong>Authentic:</strong> ${veracityResult.isAuthentic ? "Yes" : "No"}</li>
        <li><strong>Readable:</strong> ${veracityResult.isReadable ? "Yes" : "No"}</li>
        <li><strong>Meets Requirements:</strong> ${veracityResult.meetsRequirements ? "Yes" : "No"}</li>
        <li><strong>Verification Errors:</strong> ${veracityResult.errors || "None"}</li>
    </ul>
    <h2>AI Extracted Information</h2>
    <pre>${extractionResult ? JSON.stringify(extractionResult, null, 2) : "None"}</pre>
</body>
</html>
`

  return { text, html }
}

// --- Safe serialization via explicit shape (no JSON.parse(JSON.stringify)) ---
function makeSafeVeracity(result: DocumentVeracityCheckOutput) {
  return {
    isAuthentic: Boolean(result.isAuthentic),
    isReadable: Boolean(result.isReadable),
    meetsRequirements: Boolean(result.meetsRequirements),
    errors: typeof result.errors === "string" ? result.errors : null,
  }
}

function makeSafeExtraction(obj: any): Record<string, string | number | boolean | null> {
  if (!obj || typeof obj !== "object") return {}
  const safe: Record<string, string | number | boolean | null> = {}
  for (const key in obj) {
    const val = obj[key]
    if (val == null) {
      safe[key] = null
    } else if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
      safe[key] = val
    } else {
      safe[key] = String(val) // fallback to string
    }
  }
  return safe
}

// --- Main Server Action ---
export async function handleApplicationSubmit(
  prevState: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  
  const rawData = {
      firstName: formData.get("firstName"),
      middleName: formData.get("middleName"),
      lastName: formData.get("lastName"),
      citizenship: formData.get("citizenship"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      passport: formData.get("passport"),
      education: formData.getAll("education").filter(f => (f as File).size > 0),
  };

  const parsed = applicationSchema.safeParse(rawData)

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the errors below.",
      errors: parsed.error.flatten().fieldErrors,
    }
  }
  
  const { passport: passportFile, education: educationFiles, ...otherData } = parsed.data;

  try {
    // Create a plain object for notifications before consuming the file buffers
    const notificationData: NotificationData = {
      ...otherData,
      passport: passportFile.name,
      education: educationFiles.map((f) => f.name),
    }

    let arrayBuffer: ArrayBuffer
    try {
      arrayBuffer = await passportFile.arrayBuffer()
    } catch (err) {
      console.error("Failed to read passport file:", err)
      return {
        status: "error",
        message: "Could not read passport file. Please re-upload.",
      }
    }

    const base64 = Buffer.from(arrayBuffer).toString("base64")
    const dataUri = `data:${passportFile.type};base64,${base64}`

    let veracityResult: DocumentVeracityCheckOutput
    try {
      veracityResult = await documentVeracityCheck({
        documentDataUri: dataUri,
        universityRequirements: universityRequirements["Lomonosov Moscow State University"],
      })
    } catch (err) {
      console.error("AI Veracity Check failed:", err)
      return {
        status: "error",
        message: "Document verification service is unavailable. Please try again later.",
      }
    }

    const safeVeracity = makeSafeVeracity(veracityResult)

    if (!safeVeracity.isAuthentic || !safeVeracity.isReadable || !safeVeracity.meetsRequirements) {
      const { text, html } = formatApplicationForNotification(notificationData, safeVeracity, undefined);
      // Fire-and-forget notifications for failed applications
      sendTelegramMessage(text);
      sendEmail(`Application Failed: ${notificationData.firstName} ${notificationData.lastName}`, html);

      return {
        status: "error",
        message: `Document verification failed. ${safeVeracity.errors || "Unknown issue."}`,
        data: { veracity: safeVeracity },
      }
    }

    let extractionResult
    try {
      extractionResult = await extractAdditionalInfo({
        documentDataUri: dataUri,
        documentDescription: `Passport for ${parsed.data.firstName} ${parsed.data.lastName}`,
      })
    } catch (err) {
      console.error("AI Extraction failed:", err)
      // Non-fatal — continue without extraction
      extractionResult = { extractedInformation: {} }
    }

    const safeExtraction = makeSafeExtraction(extractionResult.extractedInformation)

    const { text, html } = formatApplicationForNotification(notificationData, safeVeracity, safeExtraction)

    sendTelegramMessage(text)
    sendEmail(`New Application: ${parsed.data.firstName} ${parsed.data.lastName}`, html)

    const result: ApplicationState = {
      status: "success",
      message: "Application submitted and verified successfully!",
      data: {
        veracity: safeVeracity,
        extraction: Object.keys(safeExtraction).length > 0 ? safeExtraction : undefined,
      },
    }

    return result
  } catch (error) {
    console.error("Unhandled error in handleApplicationSubmit:", error)
    return {
      status: "error",
      message: "An unexpected server error occurred. Please try again.",
    }
  }
}
