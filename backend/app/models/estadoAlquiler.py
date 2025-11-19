class EstadoAlquiler:
    def __init__(self, id_estado: int, descripcion: str):
        self.id_estado = id_estado
        self.descripcion = descripcion

    @property
    def id_estado(self):
        return self._id_estado

    @id_estado.setter
    def id_estado(self, value):
        self._id_estado = value

    @property
    def descripcion(self):
        return self._descripcion

    @descripcion.setter
    def descripcion(self, value):
        self._descripcion = value
