const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Voter credentials email template
const getVoterCredentialsTemplate = (firstName, lastName, maidenName, phoneNumber) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>STCOGA Election - Voter Credentials</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f7fa;
          padding: 20px;
        }

        .phoneText {
            color: #c29963;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 30px;
          text-align: center;
        }
        .logo {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: white;
          padding: 8px;
          margin: 0 auto 20px;
          display: block;
        }
        .header h1 {
          color: white;
          font-size: 28px;
          margin: 0;
          font-weight: 700;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 18px;
          color: #1F2937;
          margin-bottom: 20px;
          font-weight: 600;
        }
        .message {
          font-size: 15px;
          color: #6B7280;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        .credentials-box {
          background: linear-gradient(135deg, #F0F4FF 0%, #E8EEF8 100%);
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 30px;
          border-left: 4px solid #667eea;
        }
        .credential-item {
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(102, 126, 234, 0.2);
        }
        .credential-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        .credential-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #667eea;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .credential-value {
          font-size: 18px;
          color: #1F2937;
          font-weight: 600;
          word-break: break-all;
        }
        .info-box {
          background: #FFF9E6;
          border-left: 4px solid #F59E0B;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .info-box p {
          font-size: 14px;
          color: #92400E;
          margin: 0;
          line-height: 1.5;
        }
        .info-box strong {
          color: #78350F;
        }
        .btn-container {
          text-align: center;
          margin: 30px 0;
        }
        .btn {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          padding: 15px 40px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          transition: transform 0.2s ease;
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        .security-note {
          background: #F0FDF4;
          border-left: 4px solid #10B981;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .security-note p {
          font-size: 14px;
          color: #065F46;
          margin: 0;
          line-height: 1.5;
        }
        .footer {
          background: #F9FAFB;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #E5E7EB;
        }
        .footer p {
          font-size: 13px;
          color: #6B7280;
          margin: 5px 0;
        }
        .footer .copyright {
          margin-top: 20px;
          font-size: 12px;
          color: #9CA3AF;
        }
        @media only screen and (max-width: 600px) {
          .email-container {
            border-radius: 0;
          }
          .content {
            padding: 30px 20px;
          }
          .header {
            padding: 30px 20px;
          }
          .header h1 {
            font-size: 24px;
          }
          .credential-value {
            font-size: 16px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <!-- Header -->
        <div class="header">
          <img src="https://stcoga-fe.vercel.app/assets/logo.png" alt="STCOGA Logo" class="logo">
          <h1>STCOGA Election Portal</h1>
        </div>

        <!-- Content -->
        <div class="content">
          <p class="greeting">Hello ${firstName} ${lastName},</p>
          
          <p class="message">
            Welcome to the STCOGA Online Voting System! You have been successfully registered as a voter 
            for the upcoming elections. Below are your login credentials that you will use to access the 
            voting portal when the election begins.
          </p>

          <!-- Credentials Box -->
          <div class="credentials-box">
            <div class="credential-item">
              <div class="credential-label">👤 Maiden Name (Login Credential)</div>
              <div class="credential-value">${maidenName}</div>
            </div>
            <div class="credential-item">
              <div class="credential-label">📱 Phone Number (Login Credential)</div>
              <div class="credential-value phoneText">${phoneNumber}</div>
            </div>
          </div>

          <!-- Important Notice -->
          <div class="info-box">
            <p>
              <strong>⚠️ Important:</strong> Your <strong>Maiden Name</strong> and <strong>Phone Number</strong> 
              will be required to login when the election starts. Please keep this email safe and do not 
              share your credentials with anyone.
            </p>
          </div>

          <!-- Security Note -->
          <div class="security-note">
            <p>
              <strong>🔒 Security Notice:</strong> Your vote is completely anonymous and secure. Once cast, 
              votes cannot be changed or traced back to individual voters. The system ensures the integrity 
              and confidentiality of the electoral process.
            </p>
          </div>

          <!-- Call to Action -->
          <div class="btn-container">
            <a href="${process.env.FRONTEND_URL || 'https://stcoga-fe.vercel.app'}/login" class="btn">
              Go to Voting Portal
            </a>
          </div>

          <p class="message">
            If you did not register for this election or believe you received this email in error, 
            please contact the STCOGA election administrator immediately.
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p><strong>STCOGA Election Management System</strong></p>
          <p>This is an automated message. Please do not reply to this email.</p>
          <p class="copyright">© ${new Date().getFullYear()} STCOGA. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send voter credentials email
const sendVoterCredentialsEmail = async (voter) => {
  try {
    const { firstName, lastName, maidenName, phoneNumber} = voter;

    // Check if voter has email address
    if (!voter.email || RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(voter.email)) {
      console.log(`Skipping email for voter ${firstName} ${lastName} - invalid email address`);
      return { success: true, messageId: null, skipped: true };
    }

    const mailOptions = {
      from: `"STCOGA Election" <${process.env.EMAIL_USER}>`,
      to: voter.email,
      subject: 'Your STCOGA Election Voting Credentials',
      html: getVoterCredentialsTemplate(firstName, lastName, maidenName, phoneNumber)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${voter.email || 'unknown voter'}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Error sending email to ${voter.email || 'unknown voter'}:`, error);
    return { success: false, error: error.message };
  }
};

// Send bulk emails to multiple voters
const sendBulkVoterEmails = async (voters) => {
  const results = {
    total: voters.length,
    sent: 0,
    failed: 0,
    skipped: 0,
    errors: []
  };

  for (const voter of voters) {
    const result = await sendVoterCredentialsEmail(voter);
    if (result.success) {
      if (result.skipped) {
        results.skipped++;
      } else {
        results.sent++;
      }
    } else {
      results.failed++;
      results.errors.push({
        email: voter.email,
        error: result.error
      });
    }
  }

  return results;
};

module.exports = {
  sendVoterCredentialsEmail,
  sendBulkVoterEmails
};

