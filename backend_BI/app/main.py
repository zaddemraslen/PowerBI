"""
Main application entry point for backend side.

This module initializes the FastAPI application with metadata and
registers all defined API routes using the routes_main.include_routes() function.
"""

from fastapi import FastAPI
from app.routes import routes_main

# Initialize the FastAPI application
app = FastAPI(
    title= "Production & commande API",
    version= "1.0",
    description= "Backend side application for powerBI project for product and commande management."
    )

# Register all routes through the centralized router function
routes_main.include_routes(app)

@app.get("/", summary= "root")
def root():
    """
    Root endpoint for the API.
    """
    return {"message: Welcome to the production & commande API."}