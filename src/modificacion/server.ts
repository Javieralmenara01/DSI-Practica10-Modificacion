import net from 'net';
import {spawn} from 'child_process';

/**
 * Creación del servidor 
 */
net.createServer((connection) => {
  /// Mensaje de acepctación de cliente
  console.log('A client has connected.');

  /// Aquí se va a recoger el commando recibido por el cliente
  const commands: string[] = [];
  connection.on('data', (dataChunk) => {
    /// console.log(dataChunk.toString());
   
    let str = "";
    for (let i = 0; i < dataChunk.toString().length; i++) {
      const s = dataChunk.toString().at(i);
      if (s != ',') {
        str += s;
      } else {
        commands.push(str);
        str = "";
      }
    }
    commands.push(str);
    ///console.log(commands);

    let commandExec;
    if (commands.length == 1) {
      try {
        commandExec = spawn(commands[0]);
      } catch (error) {
        commandExec.on('error', (dataChunk) => {
          connection.write(dataChunk);
          connection.end();
        });
      }
    } else {
      const args = commands.splice(1, commands.length);
      try {
        commandExec = spawn(commands[0], args);
      } catch {
        commandExec.on('error', (dataChunk) => {
          connection.write(dataChunk);
          connection.end();
        }); 
      }
    }
    
    commandExec.stdout.on('data', (dataChunk) => {
      connection.write(dataChunk);
      connection.end();
    });

    commandExec.stderr.on('data', (dataChunk) => {
      connection.write(dataChunk);
      connection.end();
    });
  });

  /// Aquí se va a mostrar que se ha cerrado una conexión
  connection.on('close', () => {
    console.log('A client has disconnected.');
  });

/// Escuchando el puerto 60300
}).listen(60300, () => {
  console.log('Waiting for clients to connect.');
});