class Color:
    def __init__(self, id_color: int, descripcion: str):
        self.id_color = id_color
        self.descripcion = descripcion

    @property
    def id_color(self):
        return self._id_color

    @id_color.setter
    def id_color(self, value):
        if not isinstance(value, int) or value <= 0:
            raise ValueError('El ID de color debe ser un entero positivo')
        self._id_color = value

    @property
    def descripcion(self):
        return self._descripcion

    @descripcion.setter
    def descripcion(self, value):
        if not isinstance(value, str) or value.strip() == "":
            raise ValueError('La descripción del color no puede estar vacía')
        self._descripcion = value
