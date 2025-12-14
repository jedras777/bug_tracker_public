from django.db import models
from django.conf import settings

class Project(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='projects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class IssueStatus(models.TextChoices):
    OPEN='OPEN'
    IN_PROGRESS="IN_PROGRESS"
    DONE="DONE"

class Issue(models.Model):
    project = models.ForeignKey('Project', on_delete=models.CASCADE, related_name='issues')
    title = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=100, choices=IssueStatus.choices, default=IssueStatus.OPEN)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='creator')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)