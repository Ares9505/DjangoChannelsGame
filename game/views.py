from django.shortcuts import render

# Create your views here.
def Home(request):
	return render(request, 'base.html')

def Create_game(request):
	return render(request, 'create.html')

def Join_game(request):
	return render(request, 'join.html')

def Select_secuence(request):
	return render(request, 'select_secuence.html')

def Running_game(request):
	return render(request, 'running_game.html')