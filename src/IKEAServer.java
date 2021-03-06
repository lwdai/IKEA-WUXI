import com.sun.net.httpserver.*;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Paths;

public class IKEAServer {
    private String fileName = System.getProperty("user.dir") + "\\..\\data.json";

    class IOHandler implements HttpHandler {
        public void handle(HttpExchange t) throws IOException {

            String query = t.getRequestURI().getQuery();

            String response = "";

            if (query.startsWith("get")) {
                byte[] bytes = Files.readAllBytes(Paths.get(fileName));
                response = new String(bytes, "UTF-8");
            } else if (query.startsWith("write=")) {
                String content = query.substring(6);

                Files.write(Paths.get(fileName), content.getBytes("UTF-8"));
            }

            t.getResponseHeaders().add("Access-Control-Allow-Origin", "*");

            byte[] responseBytes = response.getBytes("UTF-8");

            t.sendResponseHeaders(200, responseBytes.length);
            OutputStream os = t.getResponseBody();

            os.write(responseBytes);

            os.close();
        }
    }


    public int run(int port) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 10);
        server.createContext("/io", new IOHandler());
        server.setExecutor(null); // creates a default executor
        server.start();
        return 0;
    }
}

