import datetime

from sqlalchemy import Column, Integer, String, ForeignKey, Table, DateTime
from sqlalchemy.orm import DeclarativeBase, column_property, mapped_column, Mapped


class Base(DeclarativeBase):
    pass

class Plants(Base):
    __tablename__ = "plants"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    location: Mapped[str]
    notes: Mapped[str]
    url: Mapped[str]
    added: Mapped[datetime.datetime]

class Care(Base):
    __tablename__ = "care"
    id: Mapped[int] = mapped_column(primary_key=True)
    plantid = mapped_column(Integer)
    type: Mapped[str]
    timestamp: Mapped[datetime.datetime]

# class UserApp(Base):
#     __tablename__ = "user_apps"
#     id: Mapped[int] = mapped_column(primary_key=True)
#     appid = mapped_column(Integer, unique=True)
#     playtime_forever: Mapped[int]
#     rtime_last_played: Mapped[int]
#     favourite: Mapped[int]
    
# class SteamAppAchievements(Base):
#     __tablename__ = "steam_app_achievements"
#     id: Mapped[int] = mapped_column(primary_key=True)
#     appid = mapped_column(Integer)
#     achievements: Mapped[int]
#     total_achievements: Mapped[int]
#     timestamp: Mapped[datetime.datetime]