import { Injectable } from '@nestjs/common';

@Injectable()
export class LogoutUseCase {
  /**
   * Realiza el cierre de sesión.
   * Al ser JWT stateless, el servidor devuelve un mensaje de éxito para que el frontend
   * proceda a eliminar los tokens de su almacenamiento local.
   * 
   * @returns Mensaje de éxito
   */
  async execute() {
    return {
      message: 'Cierre de sesión exitoso. Por favor, elimine los tokens en el cliente.',
    };
  }
}
