import { Injectable } from "@nestjs/common";
import { createTransport, Transporter } from "nodemailer";
import { sendInviteTemplate } from "./templates";

@Injectable()
export class EmailService {
  private readonly mailer: Transporter;

  constructor() {
    this.mailer = createTransport({
      tls: {
        rejectUnauthorized: true,
      },
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
    });
  }

  private async sendEmail(
    to: string,
    subject: string,
    text: string,
    html: string,
  ): Promise<void> {
    await this.mailer.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
    });
  }

  public async sendInviteEmail(
    to: string,
    inviteId: number,
    dashboardName: string,
  ): Promise<void> {
    const subject =
      `You have been invited to join ${dashboardName} on Sentinel`;
    const text =
      `You have been invited to join ${dashboardName} on Sentinel. Click the link below to accept your invite. If you did not request to join, please ignore this email.`;
    const html = sendInviteTemplate({
      inviteLink: `${process.env.BASE_INVITE_LINK}${inviteId}`,
      dashboardName,
    });

    await this.sendEmail(to, subject, text, html);
  }
}
