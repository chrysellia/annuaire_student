import pandas as pd
from faker import Faker
import random
from classes.database import database_manager
from seeder_ext import SeederExt

class Seeder:
    """
    Seeder class to create all tables and populate all tables with random data.
    """
    def __init__(self, n_students=100):
        self.n_students = n_students
        self.ext = SeederExt(n_students=n_students)

    def run_full_seed(self):
        return self.ext.run_full_seed()
