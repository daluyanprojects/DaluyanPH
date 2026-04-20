from celery import shared_task

@shared_task
def add(x, y):
    return x + y

@shared_task
def sample_task():
    # Your task logic here
    print("Running a sample Celery task!")
    return "Task completed"