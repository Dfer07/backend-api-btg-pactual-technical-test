export interface SubscriptionTemplateParams {
  userName: string;
  fundName: string;
  amount: number;
  transactionId: string;
  date: string;
  dashboardUrl: string;
}

export const getSubscriptionEmailTemplate = (params: SubscriptionTemplateParams): string => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmación de Suscripción | BTG Pactual</title>
</head>

<body style="margin:0;padding:0;background-color:#000B1D;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.1);">

          <!-- HEADER -->
          <tr>
            <td align="center" style="background:linear-gradient(135deg,#000B1D,#0a1a35);padding:45px 35px;border-bottom:4px solid #EAB308;">
              <h1 style="margin:0;font-size:26px;letter-spacing:1px;font-weight:800;text-transform:uppercase;">
                <span style="color:#ffffff;">BTG </span>
                <span style="color:#EAB308;">Pactual</span>
              </h1>
              <p style="color:#ffffff;margin:10px 0 0 0;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">
                Plataforma de Fondos de Inversión
              </p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:45px 40px;color:#1e293b;">

              <p style="font-size:18px;margin:0 0 20px 0;font-weight:600;">
                Hola, <strong>${params.userName}</strong>.
              </p>

              <p style="font-size:16px;line-height:1.7;margin:0 0 30px 0;color:#475569;">
                Te confirmamos que tu suscripción al fondo:
                <br/>
                <span style="font-size:20px;color:#000B1D;font-weight:bold;">
                  ${params.fundName}
                </span>
                <br/>
                ha sido procesada exitosamente en nuestra plataforma.
              </p>

              <!-- CAJA PRINCIPAL DE MONTO -->
              <table width="100%" cellpadding="0" cellspacing="0" 
                     style="background:#000B1D;border-radius:12px;padding:30px;margin-bottom:35px;color:#ffffff;">
                <tr>
                  <td align="center">
                    <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;font-weight:bold;">
                      Monto Total Invertido
                    </p>
                    <p style="margin:15px 0 0 0;font-size:32px;font-weight:900;color:#EAB308;">
                      COP $${params.amount.toLocaleString()}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- DETALLES ADICIONALES -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:25px;border-left:3px solid #EAB308;padding-left:15px;">
                <tr>
                  <td style="font-size:12px;color:#64748b;padding:3px 0;">
                    <strong style="color:#334155;">ID Transacción:</strong> ${params.transactionId}
                  </td>
                </tr>
                <tr>
                  <td style="font-size:12px;color:#64748b;padding:3px 0;">
                    <strong style="color:#334155;">Fecha de Operación:</strong> ${params.date}
                  </td>
                </tr>
              </table>

              <p style="font-size:14px;color:#64748b;line-height:1.7;margin-bottom:35px;">
                Esta operación ya hace parte de tu portafolio de inversión. 
                Desde tu cuenta podrás consultar el comportamiento del fondo 
                y el historial completo de tus movimientos en cualquier momento.
              </p>

              <!-- BOTÓN -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${params.dashboardUrl}" 
                       style="background:#EAB308;
                              color:#000B1D;
                              text-decoration:none;
                              padding:16px 40px;
                              border-radius:10px;
                              font-size:15px;
                              display:inline-block;
                              font-weight:800;
                              text-transform:uppercase;
                              letter-spacing:0.5px;
                              box-shadow:0 4px 15px rgba(234, 179, 8, 0.3);">
                      Gestionar mi Portafolio
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" 
                style="padding:35px;
                       font-size:11px;
                       line-height:1.6;
                       color:#94a3b8;
                       background:#f1f5f9;
                       border-top:1px solid #e2e8f0;">
              <strong style="color:#64748b;">
                © ${new Date().getFullYear()} BTG Pactual S.A. Comisionista de Bolsa
              </strong>
              <br/><br/>
              Este es un mensaje automático de confirmación. 
              Por su seguridad, BTG Pactual nunca le solicitará contraseñas, códigos ni información confidencial por este medio.
              <br/><br/>
              Si no reconoce esta operación, contacte inmediatamente a nuestra línea de atención al cliente.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
};
