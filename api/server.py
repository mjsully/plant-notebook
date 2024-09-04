import os
from dataclasses import dataclass

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import logging
import requests
from datetime import datetime
import models
from sqlalchemy import create_engine, update, delete
from sqlalchemy.dialects.sqlite import insert
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError

@asynccontextmanager
async def lifespan(app: FastAPI):

    initialise()
    yield
    logging.debug("Exiting!")

app = FastAPI(lifespan=lifespan)
logging.basicConfig(level=logging.DEBUG)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

DB_FILEPATH = "data/database.db"

# Check necessary env variables exist and create user
def initialise():

    if not os.path.exists('data'):
        os.mkdir('data')
    if not os.path.exists('data/database.db'):
        logging.debug('DB does not exist!')
        create_database()
    else:
        logging.debug('DB exists, skipping creation')

# Use ORM to create database from models
def create_database():

    engine = create_engine(f"sqlite:///{DB_FILEPATH}")
    models.Base.metadata.create_all(engine)

def get_session():

    engine = create_engine(f"sqlite:///{DB_FILEPATH}")
    Session = sessionmaker(bind=engine)
    session = Session()
    return session 

@app.get('/plants')
async def plants_get():

    def get_timestamp_data(session, id, type, relative=False):

        results = session.query(
            models.Care
        ).where(
            models.Care.plantid == id,
            models.Care.type == type
        ).order_by(
            models.Care.timestamp.desc()
        ).all()
        if results == []:
            return "Unknown"
        else:
            if relative:
                return (datetime.now() - results[0].timestamp).days
            else: 
                return results[0].timestamp.strftime('%d/%m/%Y')

    session = get_session()

    results = session.query(
        models.Plants
    ).all()

    logging.debug(results)
    results_list = []
    for result in results:
        logging.debug(result)
        get_timestamp_data(session, result.id, "water")
        results_dict = {
            "id": result.id, 
            "name": result.name,
            "location": result.location,
            "notes": result.notes,
            "url": result.url,
            "added": result.added.strftime('%d/%m/%Y'),
            "watered": get_timestamp_data(session, result.id, "water", False),
            "misted": get_timestamp_data(session, result.id, "mist", False),
            "fed": get_timestamp_data(session, result.id, "food", False),
            "watered_days_ago": get_timestamp_data(session, result.id, "water", True),
            "misted_days_ago": get_timestamp_data(session, result.id, "mist", True),
            "fed_days_ago": get_timestamp_data(session, result.id, "food", True)
        }
        results_list.append(results_dict)

    return results_list

@app.get('/plant/{id}')
async def plant_get(id: int):

    def get_timestamp_data(session, id, type, relative=False):

        results = session.query(
            models.Care
        ).where(
            models.Care.plantid == id,
            models.Care.type == type
        ).order_by(
            models.Care.timestamp.desc()
        ).all()
        if results == []:
            return "Unknown"
        else:
            if relative:
                return (datetime.now() - results[0].timestamp).days
            else: 
                return results[0].timestamp.strftime('%d/%m/%Y')

    session = get_session()

    result = session.query(
        models.Plants
    ).where(
        models.Plants.id == id
    ).one()

    logging.debug(result)
    results_dict = {}
    if result != None:
        logging.debug(result)
        get_timestamp_data(session, result.id, "water")
        results_dict = {
            "id": result.id, 
            "name": result.name,
            "location": result.location,
            "notes": result.notes,
            "url": result.url,
            "added": result.added.strftime('%d/%m/%Y'),
            "watered": get_timestamp_data(session, result.id, "water", False),
            "misted": get_timestamp_data(session, result.id, "mist", False),
            "fed": get_timestamp_data(session, result.id, "food", False),
            "watered_days_ago": get_timestamp_data(session, result.id, "water", True),
            "misted_days_ago": get_timestamp_data(session, result.id, "mist", True),
            "fed_days_ago": get_timestamp_data(session, result.id, "food", True)
        }

    return results_dict

@app.patch('/plant/{id}')
async def plant_patch(id: int, request: Request):

    def validate_json(json):

        logging.debug(json)
        if 'name' not in json.keys():
            return False
        if 'location' not in json.keys():
            return False
        if 'notes' not in json.keys():
            return False
        if 'url' not in json.keys():
            return False
        return True


    session = get_session()

    try:

        data = await request.json()
        valid_data = validate_json(data)
        logging.debug(data)
        logging.debug(f'Data validation: {valid_data}')

        if valid_data:
            logging.debug("Update incoming")
            session.execute(
                update(
                    models.Plants
                ).where(
                    models.Plants.id == id
                ).values(
                    name = data["name"],
                    location = data["location"],
                    notes = data["notes"],
                    url = data["url"]
                )
            )

            session.commit()
            session.close()
            return 200

        session.close()
        return 400

    except Exception as e:
        logging.error(e)
        return 400

@app.delete('/plant/{id}')
async def plant_delete(id: int):

    logging.debug(id)
    session = get_session()

    try:
        session.execute(
            delete(
                models.Plants
            ).where(
                models.Plants.id == id
            )
        )        
        session.execute(
            delete(
                models.Care
            ).where(
                models.Care.plantid == id
            )
        )
        session.commit()
        session.close()
        return 200
    except Exception as e:
        logging.error(e)
        return 400

@app.get('/plant/{id}/care')
async def plant_care(id: int):

    session = get_session()

    results = session.query(
        models.Care
    ).where(
        models.Care.id == id
    ).all()

    logging.debug(id)
    logging.debug(results)
    results_list = []
    for result in results:
        logging.debug(result)
        results_dict = {
            "id": result.plantid,
            "type": result.type,
            "timestamp": result.timestamp.strftime('%d/%m/%Y - %H:%M')
        }
        results_list.append(results_dict)

    return results_list

@app.post('/plants')
async def plants_post(request: Request):

    def validate_json(json):

        logging.debug(json)
        if 'name' not in json.keys():
            return False
        if 'location' not in json.keys():
            return False
        if 'notes' not in json.keys():
            return False
        if 'url' not in json.keys():
            return False
        return True

    session = get_session()

    try:

        data = await request.json()
        valid_data = validate_json(data)
        logging.debug(f'Data validation: {valid_data}')

        if valid_data:

            logging.debug("Before execute statement.")

            session.execute(
                insert(models.Plants).values(
                    name = data["name"],
                    location = data["location"],
                    notes = data["notes"],
                    url = data["url"],
                    added = datetime.now()
                )
            )

            logging.debug("After execute statement.")

            session.commit()
            session.close()
            return 200

        session.close()
        raise HTTPException(status_code=400, detail="Data was invalid")

    except SQLAlchemyError as e:

        session.close()
        logging.error(e)
        return JSONResponse(status_code=400, content="Something went wrong")
        
@app.post('/plant/{id}/care')
async def plant_care_post(request: Request):

    def validate_json(json):

        logging.debug(json)
        if 'id' not in json.keys():
            return False
        if 'type' not in json.keys():
            return False
        return True

    session = get_session()

    try:

        data = await request.json()
        valid_data = validate_json(data)
        logging.debug(f'Data validation: {valid_data}')

        if valid_data:

            session.execute(
                insert(models.Care).values(
                    plantid = data["id"],
                    type = data["type"],
                    timestamp = datetime.now()
                )
            )

            session.commit()
            session.close()
            return 200
    
        session.close()
        return 400

    except Exception as e:

        session.close()
        logging.error(e)
        return 400

if __name__ == '__main__':
    initialise()
