from typing import List
from fastapi import FastAPI, status, HTTPException
from pydantic import BaseModel
import pymongo
from fastapi.middleware.cors import CORSMiddleware
from pymongo.mongo_client import MongoClient

# MongoDB Atlas connection URI
uri = "mongodb+srv://hussainafroz903:q1234$@cluster0.fpa09.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Initialize MongoDB client
client = MongoClient(uri)
database = client.DB1  # Your database name
collection = database.cn1  # Your collection name


class Book(BaseModel):
    id: int = None
    volume_id: str
    title: str
    authors: str = None
    thumbnail: str = None
    state: int
    rating: int = None


class BookNoId(BaseModel):
    volume_id: str
    title: str
    authors: str = None
    thumbnail: str = None
    state: int
    rating: int = None


class UpdateRatingBody(BaseModel):
    volume_id: str
    new_rating: int


class UpdateStateBody(BaseModel):
    volume_id: str
    new_state: int


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Have fun
@app.get("/")
async def check_it():
    return "Hello world"


# retreive all books
@app.get("/books", response_model=List[Book], status_code=status.HTTP_200_OK)
async def get_books():
    try:
        books = list(collection.find().sort("id", pymongo.DESCENDING))
        # Convert MongoDB documents to Pydantic models
        return [Book(**book) for book in books]
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500, detail="An error occurred while retrieving books.")


# insert new book with no id ( and assigne it with a id as next maxid + 1)
@app.post("/books", status_code=status.HTTP_201_CREATED)
async def new_book(book: BookNoId):
    try:
        # Find the current maximum ID in the collection
        max_id_doc = collection.find_one(sort=[("id", pymongo.DESCENDING)])
        new_id = max_id_doc["id"] + 1 if max_id_doc else 1

        # Create a new book with the next ID
        book_with_id = Book(id=new_id, **book.dict())

        # Insert the new book into the collection
        result = collection.insert_one(book_with_id.dict())

        # Return the inserted document ID
        return {"inserted_id": new_id}

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500, detail="An error occurred while inserting the book.")


# update the rating of the book by volume_id
@app.put("/books/update_rating", status_code=200)
async def update_rating(update_rating_body: UpdateRatingBody):
    # filter
    filter = {"volume_id": update_rating_body.volume_id}

    # update
    new_rate = {"$set": {"rating": update_rating_body.new_rating}}

    # find the book with the given volume_id and set it
    result = collection.update_one(
        filter,
        new_rate
    )

    # check if the book was found and updated
    if result.matched_count == 0:
        raise HTTPException(
            status_code=404, detail=f"Book with volume_id '{update_rating_body.volume_id}' not found."
        )

    return {"message": "Rating updated successfully"}


@app.put("/books/update_state", status_code=200)
async def update_state(update_state_body: UpdateStateBody):
    # filer
    filter = {"volume_id": update_state_body.volume_id}

    # update
    new_state = {"$set": {"state": update_state_body.new_state}}

    result = collection.update_one(
        filter,
        new_state
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404, detail=f"Book with volume_id '{update_state_body.volume_id}' not found."
        )

    return {"message": "State updated successfully"}
