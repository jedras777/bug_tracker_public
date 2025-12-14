from rest_framework import serializers
from .models import Project, Issue

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"
        read_only_fields = ('owner', 'created_at', 'updated_at')


class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = "__all__"
        read_only_fields = ('created_by', 'created_at', 'updated_at')
