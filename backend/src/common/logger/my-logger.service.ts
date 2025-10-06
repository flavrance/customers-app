import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class MyLogger extends ConsoleLogger {
  log(message: any, context?: string) {
    // Adicione aqui lógicas customizadas, como enviar para um serviço de log externo
    super.log(message, this.getContext(context));
  }

  error(message: any, stack?: string, context?: string) {
    // Adicione aqui lógicas customizadas
    super.error(message, stack, this.getContext(context));
  }

  warn(message: any, context?: string) {
    // Adicione aqui lógicas customizadas
    super.warn(message, this.getContext(context));
  }

  debug(message: any, context?: string) {
    // Adicione aqui lógicas customizadas
    super.debug(message, this.getContext(context));
  }

  verbose(message: any, context?: string) {
    // Adicione aqui lógicas customizadas
    super.verbose(message, this.getContext(context));
  }

  private getContext(context?: string): string {
    return context || this.context || 'Application';
  }
}
