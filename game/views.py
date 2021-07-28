from django.shortcuts import render, redirect
import random
from .models import Game
# Create your views here.
def Home(request):
	game_id=random.randint(100000,999999)	
	while Game.objects.filter(game_id=game_id):
		game_id = random.randint(100000,999999)
	return render(request, 'base.html', {"game_id" : game_id})



def Create_game(request,player,game_id):
	if request.method =="GET":	
		game_id = int(game_id)
		game  = Game.objects.filter(game_id=game_id)
		if not game:
			game  = Game(player1=player, player2= '' ,game_id=game_id)
			game.save()		
		return render(request, 'create.html',{"game_id": game_id})



def Join_game(request,player):
	if request.method == "POST":
		game_id = request.POST.get("game_id")
		try:
			game  = Game.objects.get(game_id=game_id)
			game.player2=player
			game.save()
			Name=game.player1
			return redirect('/game/create/'+ Name +'/' + game_id + '?twoplayers')
		except:
			return render(request, 'join.html', {"novalido": "novalido"})

	if request.method == "GET":	
		return render(request, 'join.html')


def howToPlay(request):
	return render(request, 'howToPlay.html')