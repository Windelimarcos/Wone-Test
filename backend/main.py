import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

app = FastAPI()

# --- CORS Configuration ---
# Allows the React frontend (running on a different port) to communicate with the backend
origins = [
    "http://localhost:3000",  # Default port for Create React App
    "http://localhost:5173",  # Default port for Vite
    # Add any other origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Load Data ---
try:
    with open("workoutPlans.json", "r", encoding="utf-8") as f:
        workout_data = json.load(f)
        workouts = workout_data.get("workouts", [])
except FileNotFoundError:
    print("Error: workoutPlans.json not found in the backend directory.")
    workouts = []
except json.JSONDecodeError:
    print("Error: workoutPlans.json contains invalid JSON.")
    workouts = []

# --- Pydantic Models (for structure and validation - optional but recommended) ---
class ExerciseDetail(BaseModel):
    SxR: str = Field(..., alias="SxR")
    Tecnica_Avancada: str = Field(..., alias="Técnica Avançada")

class WorkoutDay(BaseModel):
    Musculacao: str = Field(..., alias="Musculação")
    Intervalo_de_descanso: str = Field(..., alias="Intervalo de descanso")
    Dia: List[str] = Field(..., alias="Dia")
    Exercicios: Dict[str, ExerciseDetail] = Field(..., alias="Exercícios")

class WorkoutObservation(BaseModel):
    Descricao: str = Field(..., alias="Descrição")

class Workout(BaseModel):
    id: str
    dono_do_treino: str
    tipo_de_treino: str
    obs: WorkoutObservation
    access: List[str]
    # Use Optional for treino days as not all workouts might have A-F
    Treino_A: Optional[WorkoutDay] = Field(None, alias="Treino A")
    Treino_B: Optional[WorkoutDay] = Field(None, alias="Treino B")
    Treino_C: Optional[WorkoutDay] = Field(None, alias="Treino C")
    Treino_D: Optional[WorkoutDay] = Field(None, alias="Treino D")
    Treino_E: Optional[WorkoutDay] = Field(None, alias="Treino E")
    Treino_F: Optional[WorkoutDay] = Field(None, alias="Treino F")

    class Config:
        allow_population_by_field_name = True # Allow using alias names

class WorkoutSummary(BaseModel):
    id: str
    tipo_de_treino: str
    dono_do_treino: str
    descricao: str

# --- API Endpoints ---

@app.get("/workouts", response_model=List[WorkoutSummary])
async def get_all_workouts():
    """Returns a summary list of all workouts."""
    summary_list = []
    for workout in workouts:
        summary_list.append(
            WorkoutSummary(
                id=workout.get("id"),
                tipo_de_treino=workout.get("tipo_de_treino"),
                dono_do_treino=workout.get("dono_do_treino"),
                descricao=workout.get("obs", {}).get("Descrição", "No description"),
            )
        )
    return summary_list

@app.get("/workouts/{workout_id}", response_model=Workout)
async def get_workout_details(workout_id: str):
    """Returns the full details for a specific workout by its ID."""
    for workout in workouts:
        if workout.get("id") == workout_id:
            # Manually construct the response dict to handle aliases if not using parse_obj
            # Or directly return the dict and let FastAPI handle validation with response_model
            return workout # FastAPI will validate this dict against the Workout model
    raise HTTPException(status_code=404, detail="Workout not found")

# --- Running the App (for development) ---
if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server...")
    print("Available workouts loaded:", len(workouts))
    # You can add more startup logs here if needed
    uvicorn.run(app, host="0.0.0.0", port=8000) 