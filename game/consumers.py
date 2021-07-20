import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Game
from channels.db import database_sync_to_async

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.game_group_name = 'game_%s' % self.game_id

        # Join game group
        await self.channel_layer.group_add(
            self.game_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.game_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):

        response = json.loads(text_data)
        event    = response.get("event", None)
        message  = response.get("message", None)

        if event == 'START':
            await self.channel_layer.group_send(self.game_group_name,{
                    'type': 'send_message',
                    'message': message,
                    'event' : "START"
                })

        if event == 'ColorSelection':
            gameid   = message['gameid']
            secuence = message['secuence']
            player   = message['player']
            #Here we use a function with database_sync_to_sync decorator
            await self.save_secuence(gameid,player,secuence)
           
            #Check that two player send the secuence
            two_secuence_check=await self.two_secuence_check(gameid)
            await self.channel_layer.group_send(self.game_group_name,{
                    'type': 'send_message',
                    'message': two_secuence_check,
                    'event' : "ColorSelection"
                })

        if event == 'ColorGuees':
            gameid=message['gameid']
            secuence=message['secuence']
            player=message['player']

            cows_bulls=await self.check_gueesing(gameid,player,secuence)
            playerName=await self.get_player_name(gameid,player)
            await self.channel_layer.group_send(self.game_group_name,{
                    'type': 'send_message',
                    'message': {
                        'player': player,#to now who attemp to guees
                        'cows': cows_bulls[0],
                        'bulls': cows_bulls[1],
                        'secuence': secuence,
                        'playerName': playerName
                    },
                    'event' : "ColorGuees"
                })
  

    async def send_message(self,res):
        await self.send(text_data=json.dumps({
            "payload": res,
            }))

    #This is the way to access the database and update records
    @database_sync_to_async
    def save_secuence(self,gameid,player,secuence):
        game=Game.objects.get(game_id=gameid)
        if player==1:
            game.player1_color_selection=secuence           
        else:
            game.player2_color_selection=secuence
        game.save()


    @database_sync_to_async
    def two_secuence_check(self,gameid):
        game=Game.objects.get(game_id=gameid)
        if game.player1_color_selection=="" or game.player2_color_selection=="":
            return "False"
        else:
            return "True"


    @database_sync_to_async
    def check_gueesing(self,gameid,player,secuence):
        game=Game.objects.get(game_id=gameid)
        if player==1:
            db_secuence=game.player2_color_selection
        else:
            db_secuence=game.player1_color_selection
        return cows_bulls(secuence,db_secuence)


    @database_sync_to_async
    def get_player_name(self,gameid,player):
        game=Game.objects.get(game_id=gameid)
        if(player==1):
            name=game.player1
        else:
            name=game.player2
        return name
                

def cows_bulls(secuence,db_secuence):
    bulls=0
    cows=0
    secuence=secuence.split(",")
    db_secuence=db_secuence.split(",")
    for i,j in zip(secuence, db_secuence):
        if i in db_secuence:
            if i==j:
                bulls+=1
            else:
                cows+=1
    return [cows, bulls]

# haciendo la funcion para definir vacas y toros




