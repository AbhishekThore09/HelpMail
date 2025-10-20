import React, { useState } from "react";
import { Mail, Paperclip, X, Send } from "lucide-react";

function App() {
  const [recipientInput, setRecipientInput] = useState("");
  const [recipients, setRecipients] = useState([]);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleAddRecipient = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const email = recipientInput.trim();
      if (email && validateEmail(email) && !recipients.includes(email)) {
        setRecipients([...recipients, email]);
        setRecipientInput("");
      } else if (email && recipients.includes(email)) {
        alert("Duplicate email");
      } else if (email) {
        alert("Invalid email");
      }
    }
  };

  const removeRecipient = (email) => {
    setRecipients(recipients.filter((r) => r !== email));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setAttachments([...attachments, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (recipients.length === 0 || !subject.trim() || !content.trim()) {
      alert("Please fill all fields correctly.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("recipients", recipients.join(","));
    formData.append("subject", subject);
    formData.append("content", content);
    attachments.forEach((file) => formData.append("attachments", file));

    try {
      const res = await fetch("https://helpmail.onrender.com", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const successCount = data.results.filter(
        (r) => r.status === "success"
      ).length;
      setStatus(`✅ ${successCount} emails sent successfully`);
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to send mail");
    } finally {
      setIsSubmitting(false);
      setRecipients([]);
      setRecipientInput("");
      setSubject("");
      setContent("");
      setAttachments([]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(var(--background))] to-[hsl(var(--secondary))/20]">
      <div className="w-full max-w-3xl p-8 shadow-lg border border-[hsl(var(--border))/50] rounded-lg bg-[hsl(var(--card))] backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center shadow-lg">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] bg-clip-text text-transparent">
              Compose Email
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] text-sm">
              Send beautiful emails with attachments
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipients */}
          {/* Recipients */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Recipients</label>
            <div className="flex flex-wrap items-center gap-2 p-3 border border-input rounded-lg bg-background focus-within:ring-2 focus-within:ring-ring transition-all">
              {recipients.map((email) => (
                <span
                  key={email}
                  className="bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1"
                >
                  {email}
                  <button
                    type="button"
                    onClick={() => removeRecipient(email)}
                    className="hover:bg-primary/30 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="email"
                placeholder="Type email..."
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value)}
                onKeyDown={handleAddRecipient}
                className="flex-1 min-w-[200px] border-0 focus-visible:ring-0 shadow-none p-0 h-7"
              />
              <button
                type="button"
                onClick={() => {
                  const email = recipientInput.trim();
                  if (
                    email &&
                    validateEmail(email) &&
                    !recipients.includes(email)
                  ) {
                    setRecipients([...recipients, email]);
                    setRecipientInput("");
                  } else if (email && recipients.includes(email)) {
                    alert("Duplicate email");
                  } else if (email) {
                    alert("Invalid email");
                  }
                }}
                className="ml-2 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-primary to-accent rounded-md hover:opacity-90 transition-all"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[hsl(var(--foreground))]">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject"
              className="w-full p-2 border rounded-lg border-[hsl(var(--input))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-all"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[hsl(var(--foreground))]">
              Message
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message here..."
              rows={5}
              className="w-full p-2 border rounded-lg border-[hsl(var(--input))] resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-all"
            />
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[hsl(var(--foreground))]">
              Attachments
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                isDragging
                  ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))/5] scale-[1.02]"
                  : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary))/50] hover:bg-[hsl(var(--accent))/5]"
              }`}
            >
              <Paperclip className="w-8 h-8 mx-auto mb-3 text-[hsl(var(--muted-foreground))]" />
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">
                Drag and drop files here, or click to browse
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <button
                type="button"
                className="px-3 py-1 border rounded-md hover:bg-[hsl(var(--primary))/10] transition-all"
                onClick={() => document.getElementById("file-upload").click()}
              >
                Browse Files
              </button>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2 mt-4">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-[hsl(var(--secondary))/50] rounded-lg border border-[hsl(var(--border))/50]"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary))/10] flex items-center justify-center shrink-0">
                        <Paperclip className="w-5 h-5 text-[hsl(var(--primary))]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="shrink-0 hover:bg-[hsl(var(--destructive))/10] rounded-full p-1"
                    >
                      <X className="w-4 h-4 text-[hsl(var(--destructive))]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] hover:opacity-90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Email
              </>
            )}
          </button>
        </form>

        {status && (
          <p className="mt-4 text-[hsl(var(--foreground))]">{status}</p>
        )}
      </div>
    </div>
  );
}

export default App;
