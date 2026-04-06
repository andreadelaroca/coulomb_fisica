import math

def calcular_fuerza_neta(q0, x0, y0, n, cargas):
    #Carga objetivo es q0, x0 y y0
    #n es el numero de cargas
    #cargas es un diccionario con las llaves q (carga), x & y para las posiciones
    
    #Constante e inicializacion
    k = 9e9 
    fx_neta = 0.0
    fy_neta = 0.0

    #Validacion
    if n != len(cargas):
        raise ValueError("El numero de cargas no coincide con la lista recibida.")
    
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


cargas = [
    {"q": 500e-6, "x": 0, "y": 0},
    {"q": -600e-6, "x": 6, "y": 0},
]

resultado = calcular_fuerza_neta(400e-6, 10, 5, 2, cargas)
print(resultado)
