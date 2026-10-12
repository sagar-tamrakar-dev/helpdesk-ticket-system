from django.db import models
from django.contrib.auth.models import User

class Ticket(models.Model):
    PRIORITY = [('LOW','Low'), ('MEDIUM','Medium'), ('HIGH','High')]
    STATUS = [('OPEN','Open'), ('IN_PROGRESS','In Progress'),
              ('RESOLVED','Resolved'), ('CLOSED','Closed')]

    title = models.CharField(max_length=200)
    description = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY, default='MEDIUM')
    status = models.CharField(max_length=15, choices=STATUS, default='OPEN')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tickets')
    assigned_to = models.ForeignKey(User, null=True, blank=True,
                                    on_delete=models.SET_NULL, related_name='assigned_tickets')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Comment(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)