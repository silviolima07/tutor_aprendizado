from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import router as api_router
import os

app = FastAPI(title="Tutor de Aprendizado")

# Root endpoint for health check / welcome
@app.get("/")
async def root():
    return {"message": "Tutor de Aprendizado API is running. Access /api/... for endpoints."}

# CORS (necessário para frontend em desenvolvimento)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar rotas da API
app.include_router(api_router, prefix="/api")

# Serve static files built by frontend (só monta se o diretório existir)
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.isdir(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")
