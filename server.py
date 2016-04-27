#!/usr/bin/python
import random
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
import chess
import time
import urlparse
import os

PORT_NUMBER = int(os.getenv('PORT', 80))

games = {}
player_ids = []

def generate_new_game():
    actual_name = 'a'
    while actual_name in games.keys():
        last_letter = ord(actual_name[-1])+1
        if last_letter > 122:
            actual_name[-1] ='a'
            last_letter = 97
        else:
            actual_name = actual_name[:-1]
        actual_name += chr(last_letter)

    games[actual_name] = [chess.Game(),None,None]

    return actual_name

def generate_player_id():
    actual_name = 'aaa'
    while actual_name in player_ids:
        last_letter = ord(actual_name[-1])+1
        if last_letter > 122:
            actual_name[-1] ='a'
            last_letter = 97
        else:
            actual_name = actual_name[:-1]
        actual_name += chr(last_letter)

    player_ids.append(actual_name)

    return actual_name

def player(game, address):
    if game[1]==address:
        return "w"
    elif game[2]==address:
        return "b"
    else:
        return "none"

class myHandler(BaseHTTPRequestHandler):
    def do_CHESS(self):
        global games
        if self.path[-7:]=="/update":
            game_id = self.path.split('/')[0] # /a/update

            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()

            if not game_id in games.keys():
                self.wfile.write("game not found")
                return

            game = games[game_id]
            
            p = player(game,self.client_address[0])
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
        if self.path[0:6] == "/game/":
            url = urlparse.urlparse(self.path)
            url_params = urlparse.parse_qs(url.query)
            
            player_id = url_params["player_id"]
            game_id = url.path[6:]

            self.send_response(200)
            self.send_header('Content-type','text/html')
            self.end_headers()

            if game_id in games.keys():
                if games[game_id][1]==None:
                    games[game_id][1]=player_id
                elif games[game_id][2]==None:
                    games[game_id][2]=player_id
                else:
                    return self.wfile.write('sorry, the game is full')    
                in_file=open("index.html","r")
                data = in_file.read()
                in_file.close()
                # Send the html message
                self.wfile.write(data)
            else:
                self.wfile.write('game not found')
        elif self.path[0:5] == '/join':
            url = urlparse.urlparse(self.path)
            game_id = url.path[6:]

            # generata hash for new user
            self.send_response(200)
            self.send_header('Content-type','text/html')
            self.end_headers()
            player_id = generate_player_id()
            self.wfile.write('Joined game. <a href="/game/'+game_id+'?player_id='+player_id+'">Go to game</a>')
        elif self.path == '/new':
            self.send_response(200)
            self.send_header('Content-type','text/html')
            self.end_headers()
            # New game logic!
            new_game_hash=generate_new_game()
            games[new_game_hash][1]=self.client_address[0]
            # self.wfile.write('')
            player_id = generate_player_id()
            self.wfile.write('New game created. <a href="/game/'+new_game_hash+'?player_id='+player_id+'">Go to game</a>')
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
