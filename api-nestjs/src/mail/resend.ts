import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResendService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get('RESEND_KEY'));
  }

  async sendVerificationEmail(email: string, verifyUrl: string) {
    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Verifique seu email',
      html: `
        <h1>Bem-vindo!</h1>
        <p>Clique no link abaixo para verificar seu email:</p>
        <a href="${verifyUrl}">Verificar Email</a>
      `,
    });
  }

  async sendLoginEmail(email: string, loginUrl: string) {
    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Link de Acesso',
      html: `
        <h1>Link de Acesso</h1>
        <p>Clique no link abaixo para fazer login:</p>
        <a href="${loginUrl}">Fazer Login</a>
      `,
    });
  }
}
