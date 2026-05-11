import sgMail from "@sendgrid/mail";
import environments from "../shared/environment";

sgMail.setApiKey(environments.SENDGRID_API_KEY);

export interface ResetPasswordMailData {
  to: string;
  username: string;
  resetLink: string;
}

export default class MailService {
  public async sendResetPassword(data: ResetPasswordMailData): Promise<void> {
    await sgMail.send({
      to: data.to,
      from: environments.SENDGRID_EMAIL_FROM,
      templateId: environments.SENDGRID_TEMPLATE_ID_RESET_PASSWORD,
      dynamicTemplateData: {
        first_name: data.username,
        reset_link: data.resetLink,
      },
    });
  }
}
