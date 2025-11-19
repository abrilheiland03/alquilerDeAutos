class Marca:
    def __init__(self, id_marca: int, descripcion: str):
        self.id_marca = id_marca
        self.descripcion = descripcion

    @property
    def id_marca(self):
        return self._id_marca

    @id_marca.setter
    def id_marca(self, value):
        if not isinstance(value, int) or value <= 0:
            raise ValueError('El ID de marca debe ser un entero positivo')
        self._id_marca = value

    @property
    def descripcion(self):
        return self._descripcion

    @descripcion.setter
    def descripcion(self, value):
        if not isinstance(value, str) or value.strip() == "":
            raise ValueError('La descripción de la marca no puede estar vacía')
        self._descripcion = value
