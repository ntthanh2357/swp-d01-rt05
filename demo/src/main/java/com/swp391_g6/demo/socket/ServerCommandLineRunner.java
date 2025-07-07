package com.swp391_g6.demo.socket;

import com.corundumstudio.socketio.SocketIOServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.stereotype.Component;

@Component
public class ServerCommandLineRunner implements CommandLineRunner, ApplicationListener<ContextClosedEvent> {

    private final SocketIOServer server;

    @Autowired
    public ServerCommandLineRunner(SocketIOServer server) {
        this.server = server;
    }

    @Override
    public void run(String... args) throws Exception {
        server.start();
        System.out.println("Socket.IO server started on port " + server.getConfiguration().getPort());
    }

    @Override
    public void onApplicationEvent(ContextClosedEvent event) {
        if (server != null) {
            System.out.println("Stopping Socket.IO server...");
            server.stop();
            System.out.println("Socket.IO server stopped.");
        }
    }
}