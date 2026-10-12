from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from .models import Ticket
from .serializers import TicketSerializer, CommentSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

ALLOWED_TRANSITIONS = {
    'OPEN': ['IN_PROGRESS'],
    'IN_PROGRESS': ['RESOLVED'],
    'RESOLVED': ['CLOSED', 'IN_PROGRESS'],
    'CLOSED': [],
}


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    u = User.objects.create_user(username=request.data['username'],
                                 password=request.data['password'])
    return Response({'id': u.id, 'username': u.username}, status=201)

@api_view(['GET'])
def me(request):
    return Response({
        'id': request.user.id,
        'username': request.user.username,
        'is_staff': request.user.is_staff,
    })

@api_view(['GET'])
@permission_classes([IsAdminUser])
def staff_list(request):
    users = User.objects.filter(is_staff=True).values('id', 'username')
    return Response(list(users))


class TicketViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    filterset_fields = ['status', 'priority', 'assigned_to']
    search_fields = ['title', 'description']

    def get_queryset(self):
        user = self.request.user
        qs = Ticket.objects.all().order_by('-created_at')
        return qs if user.is_staff else qs.filter(created_by=user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def assign(self, request, pk=None):
        ticket = self.get_object()
        ticket.assigned_to = User.objects.get(id=request.data['user_id'])
        ticket.save()
        return Response(TicketSerializer(ticket).data)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def change_status(self, request, pk=None):
        ticket = self.get_object()
        new = request.data.get('status')
        if new not in ALLOWED_TRANSITIONS[ticket.status]:
            return Response({'error': f'Cannot go from {ticket.status} to {new}'},
                            status=status.HTTP_400_BAD_REQUEST)
        ticket.status = new
        ticket.save()
        return Response(TicketSerializer(ticket).data)

    @action(detail=True, methods=['post'])
    def comment(self, request, pk=None):
        ticket = self.get_object()
        s = CommentSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        s.save(ticket=ticket, user=request.user)
        return Response(s.data, status=201)

