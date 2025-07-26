exports.welcomeMailTemplate = (firstName) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Welcome to Bloggr</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

      body {
        font-family: 'Inter', sans-serif;
        background: linear-gradient(to right, #f0f4f8, #d9e2ec);
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        overflow: hidden;
      }
      .header {
        background: linear-gradient(90deg, #4f46e5, #3b82f6);
        color: white;
        padding: 30px 20px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
      }
      .content {
        padding: 30px 25px;
        color: #333;
        text-align: center;
      }
      .content h2 {
        margin-top: 0;
        font-size: 22px;
        color: #111827;
      }
      .message {
        margin-top: 15px;
        font-size: 16px;
        color: #555;
        line-height: 1.6;
      }
      .cta-button {
        display: inline-block;
        margin-top: 30px;
        padding: 12px 24px;
        background-color: #4f46e5;
        color: white;
        text-decoration: none;
        font-size: 16px;
        border-radius: 8px;
        transition: background-color 0.3s ease;
      }
      .cta-button:hover {
        background-color: #4338ca;
      }
      .footer {
        background-color: #f9fafb;
        text-align: center;
        padding: 20px;
        font-size: 13px;
        color: #888;
      }
      .highlight {
        font-weight: 600;
        color: #111827;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to Bloggr 🎉</h1>
      </div>
      <div class="content">
        <h2>Hello ${firstName || "there"} 👋</h2>
        <p class="message">
          We're thrilled to have you join the <span class="highlight">Bloggr</span> community!<br/>
          Now you can share your ideas, write blogs, and explore amazing content created by others.
        </p>
        <p class="message">
          Start your journey now by creating your first blog or exploring trending posts.
        </p>
        <a href="https://yourapp.com/dashboard" class="cta-button">Go to Dashboard</a>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Bloggr. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};
