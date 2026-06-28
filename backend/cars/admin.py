from django.contrib import admin
from .models import CarPost, CarImage


class CarImageInline(admin.TabularInline):
    model = CarImage
    extra = 0


@admin.register(CarPost)
class CarPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'price', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('title', 'author__username')
    inlines = [CarImageInline]


@admin.register(CarImage)
class CarImageAdmin(admin.ModelAdmin):
    list_display = ('post', 'order')

