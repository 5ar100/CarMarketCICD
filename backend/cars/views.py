from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken

from .models import CarPost
from .serializers import (
    RegisterSerializer, UserSerializer,
    CarPostListSerializer, CarPostCreateSerializer, AdminPostUpdateSerializer
)


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user or request.user.is_staff


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


class MeView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class CarPostListCreateView(generics.ListCreateAPIView):
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        return CarPost.objects.filter(is_active=True)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CarPostCreateSerializer
        return CarPostListSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class CarPostDetailView(generics.RetrieveUpdateDestroyAPIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = (IsOwnerOrAdmin,)

    def get_queryset(self):
        return CarPost.objects.all()

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return CarPostCreateSerializer
        return CarPostListSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]


class MyPostsView(generics.ListAPIView):
    serializer_class = CarPostListSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return CarPost.objects.filter(author=self.request.user)


# --- Admin views ---

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff


class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = (IsAdminUser,)


class AdminUserDetailView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAdminUser,)


class AdminPostListView(generics.ListAPIView):
    queryset = CarPost.objects.all()
    serializer_class = CarPostListSerializer
    permission_classes = (IsAdminUser,)


class AdminPostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CarPost.objects.all()
    permission_classes = (IsAdminUser,)

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return AdminPostUpdateSerializer
        return CarPostListSerializer

