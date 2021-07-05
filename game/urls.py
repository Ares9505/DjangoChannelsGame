from django.urls import path 
from .views import Home, Create_game, Join_game, Select_secuence, Running_game

urlpatterns=[
	path('', Home, name='home'),
	path('create/<str:player1>/', Create_game, name='create'),
	path('join/', Join_game, name='join'),
	path('select/', Select_secuence, name='select'),
	path('running/', Running_game, name='running'),

]