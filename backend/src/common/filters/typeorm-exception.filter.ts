import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    const driverError = exception.driverError as any;

    // Exemplo: Tratar erro de violação de chave única (e.g., email duplicado)
    // O código '23505' é específico do PostgreSQL para unique_violation
    if (driverError && driverError.code === '23505') {
      statusCode = HttpStatus.CONFLICT;
      message = 'A record with the same unique value already exists.';
      // Poderíamos extrair o campo do detalhe da exceção para uma msg mais específica
      if (driverError.detail) {
        const detail = driverError.detail as string;
        const match = detail.match(/\(([^)]+)\)=\(([^)]+)\)/);
        if (match) {
          message = `The value '${match[2]}' already exists for the field '${match[1]}'.`;
        }
      }
    }

    response.status(statusCode).json({
      statusCode: statusCode,
      message: message,
      error: exception.name,
    });
  }
}
