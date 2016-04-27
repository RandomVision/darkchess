#!/usr/bin/python
import random
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
import chess
import time
import os

games={}
players={}
waiting_player=None

PORT_NUMBER = int(os.getenv('PORT', 80))

def generate_hash():
    out=""
    for i in range(10):
        out+=chr(random.randint(98,122))
    return out

def newPlayer():
    new_id=generate_hash()
    while new_id in players.keys():
        new_id=generate_hash()

    players[new_id]=None
    return new_id

def newGame(player):
    new_id=generate_hash()
    while new_id in games.keys():
        new_id=generate_hash()

    games[new_id]=[chess.Game(),player,None]
    return new_id

class myHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        global waiting_player
        if self.path=="/":
            self.send_response(200)
            self.send_header('Content-type','text/html')
            self.end_headers()
            in_file=open("index.html","r")
            data = in_file.read()
            in_file.close()
            # Send the html message
            self.wfile.write(data)

        elif self.path[:7]=="/update":
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()

            player=self.path.split("?")[1]
            
            if not player in players.keys():
                self.wfile.write("none")
                return
            if not players[player] in games.keys():
                self.wfile.write("none")
                return

            game=games[players[player]]

            if game[1]==player:
                self.wfile.write(player+","+players[player]+","+game[0].to_fen("w"))
            elif game[2]==player:
                self.wfile.write(player+","+players[player]+","+game[0].to_fen("b"))
            else:
                self.wfile.write("none")
                return
        elif self.path[:10]=="/automatch":
            player=self.path.split("?")[1]
            if player=="" or not player in players.keys():
                player=newPlayer()

            if waiting_player==None or waiting_player==player:
                waiting_player=player
            else:
                game=newGame(waiting_player)
                players[waiting_player]=game
                games[game][2]=player
                players[player]=game
                waiting_player=None

            self.wfile.write(player+",")

        elif self.path[:8]=="/newgame":
            player=self.path.split("?")[1]
            if player=="" or not player in players.keys():
                player=newPlayer()
            game=newGame(player)
            players[player]=game
            self.wfile.write(player+","+game)
        elif self.path[:9]=="/joingame":
            game=self.path.split("?")[2]
            if game in games.keys():
                player=self.path.split("?")[1]
                if player=="" or not player in players.keys():
                    player=newPlayer()
                if games[game][1] in [None,player]:
                    games[game][1]=player
                    players[player]=game
                    self.wfile.write(player+","+game)
                    return
                elif games[game][2] in [None,player]:
                    games[game][2]=player
                    players[player]=game
                    self.wfile.write(player+","+game)
                    return
            
            self.wfile.write("none,cannot join game "+game)
            return                                
        elif self.path[:5]=="/move":
            player=self.path.split("?")[2]
            
            if not player in players.keys():
                self.wfile.write("none")
                return
            if not players[player] in games.keys():
                self.wfile.write("none")
                return

            game=games[players[player]]

            if game[0].end():
                game[0]=chess.Game()

            data = self.path.split("?")[1].split(".")
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            
            game[0].move(data[0],data[1])
            
            if game[1]==player:
                self.wfile.write(player+","+players[player]+","+game[0].to_fen("w"))
            elif game[2]==player:
                self.wfile.write(player+","+players[player]+","+game[0].to_fen("b"))
            else:
                self.wfile.write("none")
                return
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