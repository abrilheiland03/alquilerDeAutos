class Documento:
    def __init__(self, id_tipo: int, descripcion: str):
        self.id_tipo = id_tipo
        self.descripcion = descripcion

    @property
    def id_tipo(self):
        return self._id_tipo

    @id_tipo.setter
    def id_tipo(self, value):
        self._id_tipo = value

    @property
    def descripcion(self):
        return self._descripcion

    @descripcion.setter
    def descripcion(self, value):
        self._descripcion = value