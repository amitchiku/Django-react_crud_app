from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=200)
    release_year = models.IntegerField()
  # or remove default if not needed

    def __str__(self):
        return self.title
