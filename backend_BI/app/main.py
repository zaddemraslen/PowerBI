"""
Main application entry point for backend side.

This module initializes the FastAPI application with metadata and
registers all defined API routes using the routes_main.include_routes() function.
"""

from fastapi import FastAPI
from app.routes import routes_main
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os 

# Initialize the FastAPI application
app = FastAPI(
    title= "Production & commande API",
    version= "1.0",
    description= "Backend side application for powerBI project for product and commande management."
    )

# Load environment variables from .env file
# Load .env variables from root-level .env file
_env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path= _env_path)


# Retrieve the individual components from .env
_PROTOCOL= "BE_PROTOCOL"
_HOST= "BE_HOST"
_PORT= "BE_PORT"
_protocol = os.getenv(_PROTOCOL)
_host = os.getenv(_HOST)
_port = os.getenv(_PORT)
_required_vars= [_protocol, _host, _port]
for _var in _required_vars:
    if _var is None:
        raise EnvironmentError(f"Missing required environment variable: {_var}")
    
# Reconstruct the full URL
_frontend_url = f"{_protocol}://{_host}:{_port}"

print("____", _frontend_url)
# Update this with your frontend's URL (React usually runs on port 5173)
_origins = [
    _frontend_url,
]

# Add the middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,              # Allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],                # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],                # Allow all headers
)
# Register all routes through the centralized router function
routes_main.include_routes(app)

@app.get("/", summary= "root")
def root():
    """
    Root endpoint for the API.
    """
    return {"message: Welcome to the production & commande API."}