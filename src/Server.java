public class Server {
    public static void main(String[] args) throws Exception {

        int port = 8080;

        new IKEAServer().run(port);
    }
}