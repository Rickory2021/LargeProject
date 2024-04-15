const sendgrid = require('@sendgrid/mail');

async function sendVerificationEmail(email, token) {
  try {
    // Set SendGrid API key
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

    //const verificationUrl = `https://slicer-nine.vercel.app/verify-email/${token}`;
    const verificationUrl = `https://slicer-nine.vercel.app/verify-email?token=${token}`;
    const msg = {
      to: email,
      from: 'poosd.group24@gmail.com', 
      subject: 'Slicer: Verify Your Email',
      html: `<p>Please verify your email by clicking on the link below:</p><a href="${verificationUrl}">Verify Email</a>`
    };

    // Send email
    await sendgrid.send(msg);
    console.log('Verification email sent successfully.');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email.');
  }
}

module.exports = {
  sendVerificationEmail
};
