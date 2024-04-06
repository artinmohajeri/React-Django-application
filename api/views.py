from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Room
from .serializers import RoomSerializer, CreateRommSerializer, UpdateRommSerializer

class RoomView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    
class GetRoom(APIView):
    serializer_class = RoomSerializer
    def get(self, request):
        code = self.request.GET.get('code')
        if code != "":
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data
                data["host"] = self.request.session.session_key == room[0].host
                return Response(data=data, status=status.HTTP_200_OK)
            return Response(data={"Bad Request":"Invalid Room Code"}, status=status.HTTP_404_NOT_FOUND)
        return Response(data={"Bad Request":"Code Not Found"}, status=status.HTTP_400_BAD_REQUEST)

class CreateRoomView(APIView):
    serializer_class = CreateRommSerializer
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
            
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            print(serializer)
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause','votes_to_skip'])
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
                room.save()
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
            
class JoinRoomView(APIView):
    def post(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        code = request.data.get("code")
        if code != "":
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                room = room[0]
                self.request.session['room_code'] = code  # if the user is currenty in a room
                return Response(data={"message":"Room Joined"}, status=status.HTTP_200_OK)
            return Response(data={"Bad Request": "Invalid Room code"}, status=status.HTTP_404_NOT_FOUND)
        return Response(data={"Bad Request":"Code Not Found"}, status=status.HTTP_400_BAD_REQUEST)
    
class UserInRoom(APIView):
    def get(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = {
            'code' : self.request.session.get('room_code')
        }
        return JsonResponse(data=data, status=status.HTTP_200_OK)

class LeaveRoom(APIView):
    def post(self, request):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')
            room_results = Room.objects.filter(host=self.request.session.session_key)
            if len(room_results) > 0:
                room_results[0].delete()
        return Response(data={'message':'Success'}, status=status.HTTP_200_OK)

class RoomExist(APIView):
    def get(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        rooms = Room.objects.all()
        data = [room.serialize() for room in rooms]
        return JsonResponse(data=data, safe=False, status=status.HTTP_200_OK)

class UpdateRoom(APIView):
    def patch(self, request):  # put => update completly | patch => update partly
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = UpdateRommSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.data.get("code")
            votes_to_skip = serializer.data.get("votes_to_skip")
            guest_can_pause = serializer.data.get("guest_can_pause")
            rooms = Room.objects.filter(code=code)
            if len(rooms) > 0:
                room = rooms[0]
                if room.host == self.request.session.session_key:
                    room.votes_to_skip = votes_to_skip
                    room.guest_can_pause = guest_can_pause
                    room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                    return Response(data=RoomSerializer(room).data, status=status.HTTP_200_OK)
                return Response({'Bad Request': "Forbidden Request..."}, status=status.HTTP_403_FORBIDDEN) 
            return Response({'Bad Request': "Invalid Room Code..."}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)