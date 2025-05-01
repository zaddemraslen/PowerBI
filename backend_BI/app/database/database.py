"""
Database Configuration

Responsibilities:
- Load environment variables needed for DB connection
- Create SQLAlchemy engine and sessionmaker
- Define the declarative base for models
- Provide `get_db()` dependency for FastAPI

Intended for use across models, CRUD layers, and route dependencies.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv 
import os

# ----------------------------- Load Environment Variables -----------------------------
# Load .env variables from root-level .env file
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path=env_path)

# Ensure all required DB connection variables are defined
required_vars = ['DB_SERVER', 'DB_DATABASE', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DRIVER']
for var in required_vars:
    if os.getenv(var) is None:
        raise EnvironmentError(f"Missing required environment variable: {var}")

# ----------------------------- Database URL Construction -----------------------------

# Extract environment values
server = os.getenv('DB_SERVER')
database = os.getenv('DB_DATABASE')
username = os.getenv('DB_USERNAME')
password = os.getenv('DB_PASSWORD')
driver = os.getenv('DB_DRIVER')

# Create SQLAlchemy engine (do not echo SQL for production use)
connection_url = f"mssql+pyodbc://{username}:{password}@{server}/{database}?driver={driver.replace(' ', '+')}"

# Establishing database connection
try:
    engine = create_engine(connection_url)
    print("Database connected successfully!")
except Exception as e:
    print(f"Error connecting to the database: {e}")

# Session factory for DB interactions (used in FastAPI dependencies)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all ORM models
Base = declarative_base()

# ----------------------------- Dependency Function -----------------------------

def get_db():
    """
    Dependency to get a database session.

    Usage in FastAPI routes:
        db: Session = Depends(get_db)

    Yields:
        Session: a SQLAlchemy database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


