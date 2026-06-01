from django.db import models


class Gender(models.TextChoices):
    MALE = "M", "Masculino"
    FEMALE = "F", "Feminino"
    NON_BINARY = "NB", "Não Binário"
    OTHER = "O", "Outro"
    PREFER_NOT_TO_SAY = "PNTS", "Prefiro não informar"


class DocumentType(models.TextChoices):
    CPF = "CPF", "CPF"
    CNPJ = "CNPJ", "CNPJ"
    PASSPORT = "PASS", "Passaporte"
