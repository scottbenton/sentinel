import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly mailer;

  constructor() {
    this.mailer = nodemailer.createTransport({});
  }
}
