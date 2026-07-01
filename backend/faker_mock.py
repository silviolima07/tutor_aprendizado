from faker import Faker
from datetime import datetime, timedelta
import random

fake = Faker()

def gerar_historico():
    historico = []
    num_cursos = random.randint(0, 3)
    topicos = ['Lógica de Programação', 'Introdução ao Python', 'Data Science com Pandas', 'Machine Learning Básico', 'React para Iniciantes']
    for i in range(num_cursos):
        historico.append({
            "topic": random.choice(topicos),
            "completedAt": (datetime.now() - timedelta(days=random.randint(10, 200))).strftime("%d/%m/%Y"),
            "grade": f"{random.randint(75, 100)}%",
            "hours": random.randint(10, 60)
        })
    return historico

def gerar_usuario(role="student"):
    return {
        "id": fake.uuid4(),
        "name": fake.name(),
        "email": fake.email(),
        "role": role,
        "avatar": f"https://api.dicebear.com/7.x/notionists/svg?seed={random.randint(1, 1000)}",
        "knowledge_level": random.choice(["Iniciante", "Intermediário", "Avançado"]),
        "history": gerar_historico() if role == "student" else []
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

# Gerar 4 alunos fictícios
USUARIOS_MOCK = [gerar_usuario("student") for _ in range(4)]
# Interações mock baseadas no primeiro aluno por padrão (retrocompatibilidade)
INTERACOES = gerar_interacoes(USUARIOS_MOCK[0]["id"])
