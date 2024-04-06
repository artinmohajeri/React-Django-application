from django.db import models
import string, random

def generate_unique_code():
    length = 6
    run = True
    while run:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Room.objects.filter(code=code).count() == 0:
            run = False
    return code

class Room(models.Model):
    code = models.CharField(max_length=8, default=generate_unique_code , unique=True)
    host = models.CharField(max_length=50, unique=True)
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        # Convert model instance to a dictionary representation
        return {
            'code': self.code,
            'host': self.host,
            'guest_can_pause' : self.guest_can_pause,
            'votes_to_skip' : self.votes_to_skip,
            'created_at' : self.created_at,
        }