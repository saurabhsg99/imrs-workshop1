// server.js
require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser"); // Still useful for other content types, but Multer handles multipart
const multer = require("multer"); // Import Multer

const app = express();
const port = process.env.PORT || 5500; // Updated port to match your frontend error

// Configure Multer for handling multipart/form-data
// Use memory storage if you just need to access file data for email, not save to disk
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors({
  origin:'https://imrsworkshop1.vercel.app/'
})); // Enable CORS for all routes
// bodyParser.urlencoded and bodyParser.json are generally not needed for multipart/form-data
// as Multer will handle parsing the body.
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// Configure Nodemailer transporter
// IMPORTANT: Replace with your actual email service credentials
const transporter = nodemailer.createTransport({
  service: "gmail", // or 'outlook', 'smtp.yourdomain.com', etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

app.get("/", (req, res) => {
  res.send("Node.js server is running!");
});

// Route to handle form submissions
// Use upload.any() to handle all fields, including files
app.post("/submit-registration", upload.any(), async (req, res) => {
  try {
    // req.body will now be populated by Multer with text fields
    const { name, email, affiliation, category, abstractTitle } = req.body;

    // req.files will contain an array of file objects
    const abstractFile = req.files.find(
      (file) => file.fieldname === "abstract-upload"
    );
    const paymentProofFile = req.files.find(
      (file) => file.fieldname === "payment-proof"
    );

    const abstractFileName = abstractFile ? abstractFile.originalname : "N/A";
    const paymentProofFileName = paymentProofFile
      ? paymentProofFile.originalname
      : "N/A";

    // Prepare attachments if files were uploaded
    const attachments = [];
    if (abstractFile) {
      attachments.push({
        filename: abstractFile.originalname,
        content: abstractFile.buffer, // Multer's memoryStorage stores file content in buffer
        contentType: abstractFile.mimetype,
      });
    }
    if (paymentProofFile) {
      attachments.push({
        filename: paymentProofFile.originalname,
        content: paymentProofFile.buffer,
        contentType: paymentProofFile.mimetype,
      });
    }

    // Construct the email content
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: email, // Send to the registrant's email for confirmation
      // You might also want to send a BCC or CC to your admin email
      // bcc: 'admin_email@example.com',
      subject: "IRSMC Conference Registration Confirmation",
      html: `
                    <h2>Dear ${name},</h2>
                    <p>Thank you for registering for the International Research Scholars' Meet & Conference!</p>
                    <p>Here are your registration details:</p>
                    <ul>
                        <li><strong>Name:</strong> ${name}</li>
                        <li><strong>Email:</strong> ${email}</li>
                        <li><strong>Affiliation:</strong> ${
                          affiliation || "N/A"
                        }</li>
                        <li><strong>Category:</strong> ${category}</li>
                        <li><strong>Abstract Title:</strong> ${
                          abstractTitle || "N/A"
                        }</li>
                        <li><strong>Abstract File:</strong> ${abstractFileName}</li>
                        <li><strong>Payment Proof File:</strong> ${paymentProofFileName}</li>
                    </ul>
                    <p>We look forward to seeing you at the conference!</p>
                    <p>Best Regards,</p>
                    <p>The IRSMC Organizing Committee</p>
                `,
      attachments: attachments, // Attach the uploaded files
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log("Registration email sent successfully to " + email);
    res
      .status(200)
      .json({
        message:
          "Registration successful! Confirmation email sent to your address.",
      });
  } catch (error) {
    console.error("Error sending registration email:", error);
    // Check if it's a Nodemailer error for more specific messages
    if (error.responseCode) {
      console.error("Nodemailer response code:", error.responseCode);
      console.error("Nodemailer response:", error.response);
    }
    res
      .status(500)
      .json({
        error:
          "Failed to send registration. Please check server logs for details.",
      });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
