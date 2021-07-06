from django.shortcuts import render, redirect
import random
from .models import Game
# Create your views here.
def Home(request):
	game_id=random.randint(100000,999999)	
	while Game.objects.filter(game_id=game_id):
		game_id=random.randint(100000,999999)
	return render(request, 'base.html', {"game_id" : game_id})

def Create_game(request,player,game_id,fromwhere):
	#If come from 'home' url create the game and fill player1 and game_id'
	if fromwhere == "home":		
		game_id = int(game_id)
		game  = Game(player1=player, player2= '' ,game_id=game_id)
		game.save()
		#If come from 'join' url create the game and fill player1 and game_id'
	if fromwhre == "join":
		game  = Game.objects.filter(game_id=game_id)
		game.player2=player
		twoplayers= True
	return render(request, 'create.html',{"game_id": game_id, "twoplayers": twoplayers})
#Se debe guardar en db cuales se han usado para hacerlos invalidos
# par nuevos usuarios

def Join_game(request,player2):
	
	#buscar en video de crud como actualizar los registros
	return render(request, 'join.html')

def Select_secuence(request):
	return render(request, 'select_secuence.html')

def Running_game(request):
	return render(request, 'running_game.html')