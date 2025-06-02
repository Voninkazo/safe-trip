import React from "react";

interface EmailTemplateProps {
  token: string;
  email: String;
}

const EmailTemplate = ({ token, email }: EmailTemplateProps) => {
  return (
    <div>
      <h2>Reset Password</h2>
      <p>
        A password reset event has been triggered. The password reset window is
        limited to two hours.
      </p>
      <p>
        If you do not reset your password within two hours, you will need to
        submit a new request.
      </p>
      To complete the password reset process, visit the following link:
      <br />
      http://localhost:4321/password/reset?token={token}
      <br />
      <p>Username: {email}</p>
    </div>
  );
};

export default EmailTemplate;
