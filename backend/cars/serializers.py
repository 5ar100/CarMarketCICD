from django.contrib.auth.models import User
from rest_framework import serializers
from .models import CarPost, CarImage


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'password2')

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'is_staff', 'date_joined')


class CarImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarImage
        fields = ('id', 'image', 'order')


class CarPostListSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    images = CarImageSerializer(many=True, read_only=True)

    class Meta:
        model = CarPost
        fields = ('id', 'title', 'price', 'description', 'contact_info',
                  'year', 'fuel_type', 'transmission', 'horsepower', 'mileage',
                  'author_username', 'images', 'is_active', 'created_at', 'updated_at')


class CarPostCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    class Meta:
        model = CarPost
        fields = ('id', 'title', 'price', 'description', 'contact_info',
                  'year', 'fuel_type', 'transmission', 'horsepower', 'mileage', 'images')

    def validate_images(self, images):
        if len(images) > 5:
            raise serializers.ValidationError('Maximum 5 images allowed per post.')
        return images

    def create(self, validated_data):
        images = validated_data.pop('images', [])
        post = CarPost.objects.create(**validated_data)
        for i, image in enumerate(images):
            CarImage.objects.create(post=post, image=image, order=i)
        return post

    def update(self, instance, validated_data):
        images = validated_data.pop('images', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if images is not None:
            instance.images.all().delete()
            for i, image in enumerate(images):
                CarImage.objects.create(post=instance, image=image, order=i)
        return instance

    def to_representation(self, instance):
        return CarPostListSerializer(instance, context=self.context).data


class AdminPostUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarPost
        fields = ('is_active',)

    def to_representation(self, instance):
        return CarPostListSerializer(instance, context=self.context).data
