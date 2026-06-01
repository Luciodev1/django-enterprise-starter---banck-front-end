from rest_framework.pagination import PageNumberPagination

from .constants import PAGINATION_DEFAULT_PAGE_SIZE, PAGINATION_MAX_PAGE_SIZE, PAGINATION_MIN_PAGE_SIZE


class StandardPagination(PageNumberPagination):
    page_size = PAGINATION_DEFAULT_PAGE_SIZE
    page_size_query_param = "page_size"
    max_page_size = PAGINATION_MAX_PAGE_SIZE
    min_page_size = PAGINATION_MIN_PAGE_SIZE
