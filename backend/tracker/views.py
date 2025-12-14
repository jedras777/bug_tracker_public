from rest_framework import viewsets
from .models import Project, Issue
from .serializers import ProjectSerializer, IssueSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    ordering_fields = ["created_at", "updated_at", "name"]
    ordering = ["-created_at"]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    filterset_fields = ['project', 'status']
    ordering_fields = ['created_at', 'updated_at', 'status']
    ordering = ['-created_at']
    search_fields = ['title', 'description']

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)