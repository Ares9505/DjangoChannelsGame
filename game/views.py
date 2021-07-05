from django.shortcuts import render, redirect
import random
from .models import Game
# Create your views here.
def Home(request):
	game_id=random.randint(100000,999999)	
	while Game.objects.filter(game_id=game_id):
		game_id=random.randint(100000,999999)
	return render(request, 'base.html', {"game_id" : game_id})

def Create_game(request,player1,game_id):
	game_id=int(game_id)
	game=Game(player1=player1, player2= '' ,game_id=game_id)
	game.save()
	return render(request, 'create.html',{"game_id": game_id})
#Se debe guardar en db cuales se han usado para hacerlos invalidos
# par nuevos usuarios

def Join_game(request):
	#buscar en video de crud como actualizar los registros
	return render(request, 'join.html')

def Select_secuence(request):
	return render(request, 'select_secuence.html')

def Running_game(request):
	return render(request, 'running_game.html')