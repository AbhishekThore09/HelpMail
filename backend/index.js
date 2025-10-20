const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure your Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "abhishekthore6@gmail.com",
    pass: "hrpp yryt xkbw suar", // or OAuth2 token
  },
});

// API endpoint to send mail
app.post("/send-mail", upload.array("attachments"), async (req, res) => {
  try {
    const { recipients, subject, content } = req.body;

    if (!recipients || !subject || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const emails = Array.isArray(recipients)
      ? recipients
      : recipients.split(",").map((e) => e.trim());

    const attachments = (req.files || []).map((file) => ({
      filename: file.originalname,
      path: file.path,
    }));

    const results = [];

    for (const email of emails) {
      try {
        const info = await transporter.sendMail({
          from: `"Abhishek Thore" <your_email@gmail.com>`, // your sender name
          to: email,
          subject: subject,
          text: content,
          attachments,
          // Add a unique Message-ID to prevent Gmail threading
          messageId: `<${Date.now()}-${Math.floor(
            Math.random() * 10000
          )}@gmail.com>`,
        });

        console.log(`✅ Sent to ${email}: ${info.response}`);
        results.push({ email, status: "success" });
      } catch (err) {
        console.error(`❌ Failed for ${email}:`, err.message);
        results.push({ email, status: "failed", error: err.message });
      }
    }

    // Delete uploaded files
    attachments.forEach((a) => fs.unlink(a.path, () => {}));

    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`✅ API running on http://localhost:${PORT}`)
);
