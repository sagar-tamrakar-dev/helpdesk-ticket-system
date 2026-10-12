from rest_framework import serializers
from .models import Ticket, Comment

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Comment
        fields = ['id', 'text', 'user', 'created_at']

class TicketSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    class Meta:
        model = Ticket
        fields = '__all__'
        read_only_fields = ['status', 'assigned_to', 'created_at', 'updated_at']