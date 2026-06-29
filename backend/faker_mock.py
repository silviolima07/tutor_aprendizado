from faker import Faker
from datetime import datetime, timedelta
import random

fake = Faker()

def gerar_usuario():
    return {
        "id": fake.uuid4(),
        "name": fake.name(),
        "email": fake.email(),
        "knowledge_level": random.choice(["Iniciante", "Intermediário", "Avançado"]),
        "daily_hours": random.choice([1, 2, 3]),
        "deadline": (datetime.now() + timedelta(weeks=random.choice([4, 8, 12]))).date().isoformat(),
        "sources": random.sample(["GitHub", "Medium", "YouTube", "Artigos"], k=2)
    }

def gerar_interacoes(usuario_id):
    interactions = []
    now = datetime.now()
    for i in range(3):
        lesson_id = random.choice([101, 102])
        interactions.append({
            "user_id": usuario_id,
            "lesson_id": lesson_id,
            "type": random.choice(["view_lesson", "quiz_attempt"]),
            "timestamp": (now - timedelta(days=i)).isoformat(),
            "duration_minutes": random.randint(5, 30),
            "quiz_score": random.randint(0, 100) if random.random() > 0.3 else None,
            "badges_earned": random.sample(["first-quiz", "weekly-streak"], k=random.randint(0, 1))
        })
    return interactions

USUARIO = gerar_usuario()
INTERACOES = gerar_interacoes(USUARIO["id"])
