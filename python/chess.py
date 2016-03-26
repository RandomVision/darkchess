import random

class Game():
	def __init__(self):
		self.turn = 1
		self.actual_player = "w"
		self.board = ["rnbqkbnr","pppppppp","........","........","........","........","PPPPPPPP","RNBQKBNR"]
		self.mangiati = ""

	def end(self):
		white=False
		black=False
		for i in range(8):
			if self.board[i].find("k")>-1:
				black=True
			if self.board[i].find("K")>-1:
				white=True
		print black,white
		return not (black and white)

	def calculate_fog(self,player):
		visible=[[False for i in range(8)] for j in range(8)]
		for x in range(1,9):
			for y in range(1,9):
				if (self.get((x,y)).islower() and player=="b") or (self.get((x,y)).isupper() and player=="w"):
					visible[8-y][x-1]=True
					for mv in self.moves((x,y)):
						visible[8-mv[1]][mv[0]-1]=True
		return visible


	def to_fen(self,player):
		visible=self.calculate_fog(player)
		out=""
		for i in range(8):
			temp = self.board[i].replace(".","1")
			for k in range(8):
				if not visible[i][k]:
					out+="?"
				elif (temp[k]=="1" and k>0):
					try:
						num=int(out[-1])
						if 0<num<9:
							out=out[:-1]+str(num+1)
						else:
							out+="1"
					except:
						out+="1"
				else:
					out+=temp[k]
			out+="/"
		out=out[:-1]

		out+="#"+self.actual_player+"#"+player+"#"+self.mangiati
		return out

	def get(self,pos):
		if 0<pos[0]<9 and 0<pos[1]<9:
			try:
				return self.board[8-pos[1]][pos[0]-1]
			except:
				return "!"
		else:
			return "!"

	def set(self,pos,piece,add_to_mangiati=False):
		#promote pawn to queen
		if add_to_mangiati:
			pp=self.get(pos)
			if not(pp in [".","!"]):
				self.mangiati+=pp
		if pos[1]==1 and piece=="p":
			piece="q"
		elif pos[1]==8 and piece=="P":
			piece="Q"

		self.board[8-pos[1]]=self.board[8-pos[1]][:pos[0]-1]+piece+self.board[8-pos[1]][pos[0]:]

	def owner(self,pos):
		if self.get(pos).islower():
			return "b"
		elif self.get(pos).isupper():
			return "w"
		else:
			return None

	def moves(self,pos):
		out=[]
		piece=self.get(pos)
		if piece=="P":
			if self.get((pos[0],pos[1]+1))==".":
				out.append((pos[0],pos[1]+1))
			if pos[1]==2 and self.get((pos[0],pos[1]+2))==".":
				out.append((pos[0],pos[1]+2))
			if self.get((pos[0]-1,pos[1]+1)).islower():
				out.append((pos[0]-1,pos[1]+1))
			if self.get((pos[0]+1,pos[1]+1)).islower():
				out.append((pos[0]+1,pos[1]+1))
		elif piece=="p":
			if self.get((pos[0],pos[1]-1))==".":
				out.append((pos[0],pos[1]-1))
			if pos[1]==7 and self.get((pos[0],pos[1]-2))==".":
				out.append((pos[0],pos[1]-2))
			if self.get((pos[0]-1,pos[1]-1)).isupper():
				out.append((pos[0]-1,pos[1]-1))
			if self.get((pos[0]+1,pos[1]-1)).isupper():
				out.append((pos[0]+1,pos[1]-1))
		elif piece=="N":
			for p in [(-1,-2),(1,-2),(-1,2),(1,2),(-2,-1),(2,-1),(-2,1),(2,1)]:
				piece=self.get((pos[0]+p[0],pos[1]+p[1]))
				if piece=="." or piece.islower():
					out.append((pos[0]+p[0],pos[1]+p[1]))
		elif piece=="n":
			for p in [(-1,-2),(1,-2),(-1,2),(1,2),(-2,-1),(2,-1),(-2,1),(2,1)]:
				piece=self.get((pos[0]+p[0],pos[1]+p[1]))
				if piece=="." or piece.isupper():
					out.append((pos[0]+p[0],pos[1]+p[1]))
		elif piece=="K":
			for p in [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]:
				piece=self.get((pos[0]+p[0],pos[1]+p[1]))
				if piece=="." or piece.islower():
					out.append((pos[0]+p[0],pos[1]+p[1]))
		elif piece=="k":
			for p in [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]:
				piece=self.get((pos[0]+p[0],pos[1]+p[1]))
				if piece=="." or piece.isupper():
					out.append((pos[0]+p[0],pos[1]+p[1]))
		elif piece=="R":
			for i in range(pos[0]-1,0,-1):
				piece=self.get((i,pos[1]))
				if piece==".":
					out.append((i,pos[1]))
				else:
					if piece.islower():
						out.append((i,pos[1]))
					break
			for i in range(pos[0]+1,9):
				piece=self.get((i,pos[1]))
				if piece==".":
					out.append((i,pos[1]))
				else:
					if piece.islower():
						out.append((i,pos[1]))
					break
			for i in range(pos[1]-1,0,-1):
				piece=self.get((pos[0],i))
				if piece==".":
					out.append((pos[0],i))
				else:
					if piece.islower():
						out.append((pos[0],i))
					break
			for i in range(pos[1]+1,9):
				piece=self.get((pos[0],i))
				if piece==".":
					out.append((pos[0],i))
				else:
					if piece.islower():
						out.append((pos[0],i))
					break
		elif piece=="r":
			for i in range(pos[0]-1,0,-1):
				piece=self.get((i,pos[1]))
				if piece==".":
					out.append((i,pos[1]))
				else:
					if piece.isupper():
						out.append((i,pos[1]))
					break
			for i in range(pos[0]+1,9):
				piece=self.get((i,pos[1]))
				if piece==".":
					out.append((i,pos[1]))
				else:
					if piece.isupper():
						out.append((i,pos[1]))
					break
			for i in range(pos[1]-1,0,-1):
				piece=self.get((pos[0],i))
				if piece==".":
					out.append((pos[0],i))
				else:
					if piece.isupper():
						out.append((pos[0],i))
					break
			for i in range(pos[1]+1,9):
				piece=self.get((pos[0],i))
				if piece==".":
					out.append((pos[0],i))
				else:
					if piece.isupper():
						out.append((pos[0],i))
					break
		elif piece=="B":
			for i in range(1,8):
				piece=self.get((pos[0]+i,pos[1]+i))
				if piece==".":
					out.append((pos[0]+i,pos[1]+i))
				else:
					if piece.islower():
						out.append((pos[0]+i,pos[1]+i))
					break
			for i in range(1,8):
				piece=self.get((pos[0]-i,pos[1]+i))
				if piece==".":
					out.append((pos[0]-i,pos[1]+i))
				else:
					if piece.islower():
						out.append((pos[0]-i,pos[1]+i))
					break
			for i in range(1,8):
				piece=self.get((pos[0]+i,pos[1]-i))
				if piece==".":
					out.append((pos[0]+i,pos[1]-i))
				else:
					if piece.islower():
						out.append((pos[0]+i,pos[1]-i))
					break
			for i in range(1,8):
				piece=self.get((pos[0]-i,pos[1]-i))
				if piece==".":
					out.append((pos[0]-i,pos[1]-i))
				else:
					if piece.islower():
						out.append((pos[0]-i,pos[1]-i))
					break
		elif piece=="b":
			for i in range(1,8):
				piece=self.get((pos[0]+i,pos[1]+i))
				if piece==".":
					out.append((pos[0]+i,pos[1]+i))
				else:
					if piece.isupper():
						out.append((pos[0]+i,pos[1]+i))
					break
			for i in range(1,8):
				piece=self.get((pos[0]-i,pos[1]+i))
				if piece==".":
					out.append((pos[0]-i,pos[1]+i))
				else:
					if piece.isupper():
						out.append((pos[0]-i,pos[1]+i))
					break
			for i in range(1,8):
				piece=self.get((pos[0]+i,pos[1]-i))
				if piece==".":
					out.append((pos[0]+i,pos[1]-i))
				else:
					if piece.isupper():
						out.append((pos[0]+i,pos[1]-i))
					break
			for i in range(1,8):
				piece=self.get((pos[0]-i,pos[1]-i))
				if piece==".":
					out.append((pos[0]-i,pos[1]-i))
				else:
					if piece.isupper():
						out.append((pos[0]-i,pos[1]-i))
					break
		elif piece=="Q":
			for i in range(pos[0]-1,0,-1):
				piece=self.get((i,pos[1]))
				if piece==".":
					out.append((i,pos[1]))
				else:
					if piece.islower():
						out.append((i,pos[1]))
					break
			for i in range(pos[0]+1,9):
				piece=self.get((i,pos[1]))
				if piece==".":
					out.append((i,pos[1]))
				else:
					if piece.islower():
						out.append((i,pos[1]))
					break
			for i in range(pos[1]-1,0,-1):
				piece=self.get((pos[0],i))
				if piece==".":
					out.append((pos[0],i))
				else:
					if piece.islower():
						out.append((pos[0],i))
					break
			for i in range(pos[1]+1,9):
				piece=self.get((pos[0],i))
				if piece==".":
					out.append((pos[0],i))
				else:
					if piece.islower():
						out.append((pos[0],i))
					break
			for i in range(1,8):
				piece=self.get((pos[0]+i,pos[1]+i))
				if piece==".":
					out.append((pos[0]+i,pos[1]+i))
				else:
					if piece.islower():
						out.append((pos[0]+i,pos[1]+i))
					break
			for i in range(1,8):
				piece=self.get((pos[0]-i,pos[1]+i))
				if piece==".":
					out.append((pos[0]-i,pos[1]+i))
				else:
					if piece.islower():
						out.append((pos[0]-i,pos[1]+i))
					break
			for i in range(1,8):
				piece=self.get((pos[0]+i,pos[1]-i))
				if piece==".":
					out.append((pos[0]+i,pos[1]-i))
				else:
					if piece.islower():
						out.append((pos[0]+i,pos[1]-i))
					break
			for i in range(1,8):
				piece=self.get((pos[0]-i,pos[1]-i))
				if piece==".":
					out.append((pos[0]-i,pos[1]-i))
				else:
					if piece.islower():
						out.append((pos[0]-i,pos[1]-i))
					break
		elif piece=="q":
			for i in range(pos[0]-1,0,-1):
				piece=self.get((i,pos[1]))
				if piece==".":
					out.append((i,pos[1]))
				else:
					if piece.isupper():
						out.append((i,pos[1]))
					break
			for i in range(pos[0]+1,9):
				piece=self.get((i,pos[1]))
				if piece==".":
					out.append((i,pos[1]))
				else:
					if piece.isupper():
						out.append((i,pos[1]))
					break
			for i in range(pos[1]-1,0,-1):
				piece=self.get((pos[0],i))
				if piece==".":
					out.append((pos[0],i))
				else:
					if piece.isupper():
						out.append((pos[0],i))
					break
			for i in range(pos[1]+1,9):
				piece=self.get((pos[0],i))
				if piece==".":
					out.append((pos[0],i))
				else:
					if piece.isupper():
						out.append((pos[0],i))
					break
			for i in range(1,8):
				piece=self.get((pos[0]+i,pos[1]+i))
				if piece==".":
					out.append((pos[0]+i,pos[1]+i))
				else:
					if piece.isupper():
						out.append((pos[0]+i,pos[1]+i))
					break
			for i in range(1,8):
				piece=self.get((pos[0]-i,pos[1]+i))
				if piece==".":
					out.append((pos[0]-i,pos[1]+i))
				else:
					if piece.isupper():
						out.append((pos[0]-i,pos[1]+i))
					break
			for i in range(1,8):
				piece=self.get((pos[0]+i,pos[1]-i))
				if piece==".":
					out.append((pos[0]+i,pos[1]-i))
				else:
					if piece.isupper():
						out.append((pos[0]+i,pos[1]-i))
					break
			for i in range(1,8):
				piece=self.get((pos[0]-i,pos[1]-i))
				if piece==".":
					out.append((pos[0]-i,pos[1]-i))
				else:
					if piece.isupper():
						out.append((pos[0]-i,pos[1]-i))
					break

		return out

	def changeplayer(self):
		if self.actual_player=="w":
			self.actual_player="b"
		else:
			self.actual_player="w"

	def move(self,start,end):

		start=(ord(start[0])-96,int(start[1]))
		end=(ord(end[0])-96,int(end[1]))
		
		if not (0<start[0]<9 and 0<start[1]<9 and 0<end[0]<9 and 0<end[1]<9):
			return
		
		print "moving  "+str(start)+"->"+str(end)

		if not self.owner(start)==self.actual_player:
			print "not "+self.owner(start)+" turn"
			return

		if end in self.moves(start):
			self.set(end,self.get(start),True)
			self.set(start,".")
			self.changeplayer()
		else:
			print "cannot move "+str(start)+"->"+str(end)