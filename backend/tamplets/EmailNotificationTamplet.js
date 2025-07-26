exports.notificationMailTemplate = ({ username, actionType, actorName, postTitle, commentContent, link }) => {
  let actionMessage = "";

  switch (actionType) {
    case "like":
      actionMessage = `<strong>${actorName}</strong> liked your post: <em>${postTitle}</em>.`;
      break;
    case "comment":
      actionMessage = `<strong>${actorName}</strong> commented on your post: <em>${postTitle}</em>.<br/><br/>
                       <blockquote style="margin: 10px 0; padding-left: 15px; border-left: 3px solid #4f46e5; color: #444;">
                         "${commentContent || 'Great post!'}"
                       </blockquote>`;
      break;
    case "follow":
      actionMessage = `<strong>${actorName}</strong> started following you.`;
      break;
    default:
      actionMessage = `You have a new notification.`;
  }

  const postLinkButton = link
    ? `<a href="${link}" class="cta-button" style="margin-top: 10px; background-color: #10b981;">View Post</a>`
    : "";

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Notification from Bloggr</title>
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
        font-size: 26px;
        font-weight: 700;
      }
      .content {
        padding: 30px 25px;
        color: #333;
        text-align: center;
      }
      .content h2 {
        margin-top: 0;
        font-size: 20px;
        color: #111827;
      }
      .message {
        font-size: 16px;
        margin-top: 20px;
        line-height: 1.6;
        color: #444;
      }
      .cta-button {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 24px;
        background-color: #4f46e5;
        color: white !important;
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
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>New Notification 📢</h1>
      </div>
      <div class="content">
        <h2>Hello ${username || "there"},</h2>
        <p class="message">
          ${actionMessage}
        </p>
        <a href="https://yourapp.com/notifications" class="cta-button"> ${actionType === "follow" ? "View user profile":  "View Post on Bloggr"}</a>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Bloggr. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};
