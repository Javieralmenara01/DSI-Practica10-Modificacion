import net from 'net';

/**
 * Cliente
 */
if (process.argv.length < 3) {
  console.log('Please, provide a command.');
} else {
  /// Obtener el comando de la línea de comandos
  const command = process.argv.splice(2, process.argv.length);
  const client = net.connect({port: 60300});
  client.write(command.toString());

  /// Recepción de datos
  let str = '';
  client.on('data', (dataChunk) => {
    str += dataChunk.toString();
  });

  /// Cierre de la conexión
  client.on('close', () => {
    console.log(str);
  })
}
