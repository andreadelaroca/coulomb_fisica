import math
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import List

app = FastAPI(title="Calculadora de Fuerza Neta")

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

class Carga(BaseModel):
    q: float
    x: float
    y: float


class FuerzaRequest(BaseModel):
    q0: float
    x0: float
    y0: float
    cargas: List[Carga]


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(request, "index.html")


@app.post("/calcular")
async def calcular(data: FuerzaRequest):
    try:
        resultado = calcular_fuerza_neta(
            q0=data.q0,
            x0=data.x0,
            y0=data.y0,
            cargas=[c.model_dump() for c in data.cargas]
        )
        return JSONResponse({"ok": True, "resultado": resultado})
    except ValueError as e:
        return JSONResponse({"ok": False, "error": str(e)})
    except Exception:
        return JSONResponse({"ok": False, "error": "Ocurrio un error inesperado."})

def calcular_fuerza_neta(q0, x0, y0, cargas):
    #Carga objetivo es q0, x0 y y0
    #n es el numero de cargas
    #cargas es un diccionario con las llaves q (carga), x & y para las posiciones
    
    #Constante e inicializacion
    k = 9e9 
    fx_neta = 0.0
    fy_neta = 0.0

    
    #Calculos de cargas i
    for carga in cargas:
        qi = carga["q"]
        xi = carga["x"]
        yi = carga["y"]
    
        #Calcular vector entre carga I y carga objetivo
        vx = x0 - xi
        vy = y0 - yi
    
        #Vector unitario
        r = math.sqrt(pow(vx, 2) + pow(vy, 2))
        ux = vx/r
        uy = vy/r
    
        fx = k * q0 * qi * ux / pow(r, 2)
        fy = k * q0 * qi * uy / pow(r, 2)
    
        fx_neta += fx
        fy_neta += fy

    magnitud = math.sqrt(fx_neta**2 + fy_neta**2)

    return {
        "fx": fx_neta,
        "fy": fy_neta,
        "magnitud": magnitud
    }



