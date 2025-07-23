export function contactFormToAdmin({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 32px 24px; border-radius: 18px; box-shadow: 0 4px 24px rgba(0,0,0,0.3); max-width: 600px; margin:auto; border: 1px solid #1e293b;">
      <h2 style="font-size: 1.8rem; font-weight: 800; color: #60a5fa; margin-bottom: 16px; letter-spacing: -0.5px;">
        New Contact Form Submission
      </h2>
      <div style="margin-bottom: 16px; display: flex;">
        <span style="font-weight: 600; color: #93c5fd; min-width: 80px;">Name:</span>
        <span style="color: #bfdbfe;">${name}</span>
      </div>
      <div style="margin-bottom: 16px; display: flex;">
        <span style="font-weight: 600; color: #93c5fd; min-width: 80px;">Email:</span>
        <span style="color: #bfdbfe;">${email}</span>
      </div>
      <div style="margin-bottom: 8px; font-weight: 600; color: #93c5fd;">
        Message:
      </div>
      <div style="background: #1e293b; color: #f8fafc; padding: 18px; border-radius: 10px; font-size: 1rem; line-height: 1.6; border-left: 4px solid #3b82f6;">
        ${message}
      </div>
      <div style="margin-top: 24px; font-size: 0.9rem; color: #94a3b8; border-top: 1px solid #1e293b; padding-top: 16px;">
        This message was sent via the contact form on your website.
      </div>
    </div>
  `;
}

export function contactFormToSender({
  name,
  message,
  subject,
}: {
  name: string;
  message: string;
  subject?: string;
}) {
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 32px 24px; border-radius: 18px; box-shadow: 0 4px 24px rgba(0,0,0,0.3); max-width: 600px; margin:auto; border: 1px solid #1e293b;">
      <h2 style="font-size: 1.8rem; font-weight: 800; color: #60a5fa; margin-bottom: 20px; letter-spacing: -0.5px;">
        Thank You for Contacting Us!
      </h2>
      <p style="font-size: 1.1rem; margin-bottom: 18px; line-height: 1.6;">
        Hi <span style="color: #bfdbfe; font-weight: 600;">${name}</span>,
      </p>
      <p style="margin-bottom: 18px; line-height: 1.6; color: #cbd5e1;">
        We've received your message and our team will review it shortly. 
        You can expect a response within 24-48 hours.
      </p>

      ${
        subject
          ? `
      <div style="margin: 24px 0 12px 0;">
        <div style="font-weight: 600; color: #93c5fd; margin-bottom: 6px;">Subject:</div>
        <div style="color: #f8fafc;">${subject}</div>
      </div>
      `
          : ''
      }

      <div style="margin: 16px 0;">
        <div style="font-weight: 600; color: #93c5fd; margin-bottom: 8px;">Your Message:</div>
        <div style="background: #1e293b; color: #f8fafc; padding: 16px; border-radius: 8px; line-height: 1.6; border-left: 3px solid #3b82f6;">
          ${message}
        </div>
      </div>

      <p style="margin: 24px 0 18px 0; line-height: 1.6; color: #cbd5e1;">
        If you need to add any additional information, please reply to this email.
      </p>

      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #1e293b;">
        <p style="color: #94a3b8; font-size: 0.95rem; margin-bottom: 4px;">
          Warm regards,
        </p>
        <p style="font-weight: 600; color: #93c5fd; font-size: 1.1rem; margin: 0;">
          The SaifMarks Team
        </p>
      </div>
    </div>
  `;
}
