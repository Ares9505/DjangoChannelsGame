from django.db import models

# Create your models here.
class Game(models.Model):
	player1 = models.CharField( max_length=50)
	player2 = models.CharField( max_length=50)
	game_id = models.IntegerField()


	def __str__(self):
		return str(self.game_id)