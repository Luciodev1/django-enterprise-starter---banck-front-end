import re

from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def validate_phone(value):
    pattern = r"^\+?1?\d{10,15}$"
    if not re.match(pattern, value):
        raise ValidationError(_("Phone number must be in format: +5511999999999"))


def validate_document(value):
    digits = re.sub(r"\D", "", value)
    if len(digits) == 11:
        if not validate_cpf(digits):
            raise ValidationError(_("Invalid CPF"))
    elif len(digits) == 14:
        if not validate_cnpj(digits):
            raise ValidationError(_("Invalid CNPJ"))
    else:
        raise ValidationError(_("Document must have 11 (CPF) or 14 (CNPJ) digits"))


def validate_cpf(cpf):
    if len(set(cpf)) == 1:
        return False
    for i in range(9, 11):
        v = sum(int(cpf[j]) * ((i + 1) - j) for j in range(i)) % 11
        if v < 2:
            v = 0
        else:
            v = 11 - v
        if int(cpf[i]) != v:
            return False
    return True


def validate_cnpj(cnpj):
    if len(set(cnpj)) == 1:
        return False
    weights_first = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    weights_second = [6] + weights_first
    for i, weights in enumerate([weights_first, weights_second]):
        v = sum(int(cnpj[j]) * w for j, w in enumerate(weights)) % 11
        v = 0 if v < 2 else 11 - v
        if int(cnpj[12 + i]) != v:
            return False
    return True


def validate_password_strength(value):
    if len(value) < 8:
        raise ValidationError("Password must be at least 8 characters")
    if not re.search(r"[A-Z]", value):
        raise ValidationError("Password must contain at least one uppercase letter")
    if not re.search(r"[a-z]", value):
        raise ValidationError("Password must contain at least one lowercase letter")
    if not re.search(r"\d", value):
        raise ValidationError("Password must contain at least one number")
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
        raise ValidationError("Password must contain at least one special character")
