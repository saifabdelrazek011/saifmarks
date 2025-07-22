export const verifyEmail = (code, frontendUrl) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email - SaifMarks</title>
    <style>
      body {
        font-family: 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
        background-color: #f9fafb;
        color: #111827;
        margin: 0;
        padding: 0;
        line-height: 1.5;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
        border: 1px solid #e5e7eb;
        overflow: hidden;
      }
      .header {
        background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
        color: #ffffff;
        text-align: center;
        padding: 32px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        letter-spacing: -0.5px;
      }
      .header span {
        font-weight: 600;
        opacity: 0.9;
      }
      .content {
        padding: 32px;
        text-align: center;
      }
      .content h2 {
        color: #1e40af;
        margin: 0 0 16px 0;
        font-size: 22px;
        font-weight: 600;
      }
      .content p {
        font-size: 15px;
        margin-bottom: 24px;
        color: #4b5563;
      }
      .verify-code-box {
        margin: 24px 0;
      }
      .verify-code {
        font-size: 28px;
        letter-spacing: 6px;
        font-weight: 700;
        background: #f3f4f6;
        color: #1e40af;
        padding: 16px 24px;
        border-radius: 8px;
        display: inline-block;
        border: 1px solid #d1d5db;
        font-family: monospace;
      }
      .cta-button {
        display: inline-block;
        margin: 20px 0;
        padding: 12px 24px;
        background: #2563eb;
        color: white !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(37, 99, 235, 0.1);
      }
      .notice-box {
        margin: 24px 0;
        padding: 16px;
        background-color: #f8fafc;
        border-radius: 8px;
        border-left: 4px solid #2563eb;
        text-align: left;
        font-size: 14px;
      }
      .security-notice {
        background-color: #fffbeb;
        border-left: 4px solid #f59e0b;
        color: #92400e;
      }
      .footer {
        background-color: #f3f4f6;
        padding: 24px;
        text-align: center;
        border-top: 1px solid #e5e7eb;
        color: #6b7280;
        font-size: 13px;
      }
      .footer a {
        color: #2563eb;
        text-decoration: none;
      }
      @media only screen and (max-width: 600px) {
        .container {
          margin: 0;
          border-radius: 0;
        }
        .content {
          padding: 24px 16px;
        }
        .verify-code {
          font-size: 20px;
          letter-spacing: 4px;
          padding: 12px 16px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Saif<span>Marks</span></h1>
      </div>
      <div class="content">
        <h2>Verify Your Email Address</h2>
        <p>
          Thank you for registering with SaifMarks. To activate your account, please verify your email address using the code below:
        </p>
        
        <div class="verify-code-box">
          <div class="verify-code">${code}</div>
        </div>

        <p>
          <a href="${frontendUrl}/#/verify" class="cta-button">Verify Email Now</a>
        </p>

        <div class="notice-box">
          <p><strong>How to verify:</strong> Enter the code above on the <a href="${frontendUrl}/#/verify">verification page</a>, or click the button.</p>
        </div>

        <div class="notice-box security-notice">
          <p><strong>Security Alert:</strong> This code expires in <strong>15 minutes</strong>. If you did not request this, please ignore this email or <a href="mailto:support@saifmarks.org">contact support</a>.</p>
        </div>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} SaifMarks. All rights reserved.</p>
        <p>Need help? <a href="mailto:support@saifmarks.org">Contact Support</a></p>
      </div>
    </div>
  </body>
</html>
`;
  return html;
};
