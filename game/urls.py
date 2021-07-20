from django.urls import path 
from .views import Home, Create_game, Join_game

urlpatterns=[
	path('', Home, name='home'),
	path('create/<str:player>/<str:game_id>/', Create_game, name='create'),
	path('join/<str:player>/', Join_game, name='join'),
]