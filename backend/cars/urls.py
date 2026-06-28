from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # Auth
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', views.MeView.as_view(), name='me'),

    # Posts
    path('posts/', views.CarPostListCreateView.as_view(), name='post-list-create'),
    path('posts/my/', views.MyPostsView.as_view(), name='my-posts'),
    path('posts/<int:pk>/', views.CarPostDetailView.as_view(), name='post-detail'),

    # Admin
    path('admin-panel/users/', views.AdminUserListView.as_view(), name='admin-users'),
    path('admin-panel/users/<int:pk>/', views.AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('admin-panel/posts/', views.AdminPostListView.as_view(), name='admin-posts'),
    path('admin-panel/posts/<int:pk>/', views.AdminPostDetailView.as_view(), name='admin-post-detail'),
]
