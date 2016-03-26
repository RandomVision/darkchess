#!/usr/bin/python
import random
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
import chess
import time


PORT_NUMBER = 8888

player_white=None
player_black=None
game=chess.Game()

def player(address):
    if player_white==address:
        return "w"
    elif player_black==address:
        return "b"
    else:
        return "none"


class myHandler(BaseHTTPRequestHandler):
    def do_CHESS(self):
        global player_white,player_black,game
        if self.path=="/update":
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            p = player(self.client_address[0])
            if not p=="none":
                self.wfile.write(game.to_fen(p))
            elif self.client_address[0]==player_white:
                self.wfile.write(game.to_fen("w"))
            elif self.client_address[0]==player_black:
                self.wfile.write(game.to_fen("b"))
            elif player_white==None:
                player_white=self.client_address[0]
                print "white is "+str(self.client_address[0])
                self.wfile.write(game.to_fen("w"))
            elif player_black==None:
                player_black=self.client_address[0]
                print "black is "+str(self.client_address[0])
                self.wfile.write(game.to_fen("b"))
            else:
                self.wfile.write("the game is full")
        else:
            if game.end():
                game=chess.Game()
            data = self.path[1:].split(".")
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            p = player(self.client_address[0])
            
            game.move(data[0],data[1])
            
            self.wfile.write(game.to_fen(p))

    def do_GET(self):
        if self.path=="/":
            self.send_response(200)
            self.send_header('Content-type','text/html')
            self.end_headers()
            in_file=open("index.html","r")
            data = in_file.read()
            in_file.close()
            # Send the html message
            self.wfile.write(data)
        else:
            test=self.path.split(".")[-1]
            try:
                self.send_response(200)
                if test=="css":
                    self.send_header('Content-type','text/css')
                elif test=="png":
                    self.send_header('Content-type','image/png')
                else:
                    self.send_header('Content-type','text/html')
                
                self.end_headers()
                if test=="png":
                    in_file=open(self.path[1:],"rb")
                else:
                    in_file=open(self.path[1:],"r")
                data = in_file.read()
                in_file.close()
                # Send the html message
                self.wfile.write(data)
            except:
                self.wfile.write("file not found")


try:
    #Create a web server and define the handler to manage the
    #incoming request
    server = HTTPServer(('', PORT_NUMBER), myHandler)
    print 'Started httpserver on port ' , PORT_NUMBER
    
    #Wait forever for incoming htto requests
    server.serve_forever()

except KeyboardInterrupt:
    print '^C received, shutting down the web server'
    server.socket.close()