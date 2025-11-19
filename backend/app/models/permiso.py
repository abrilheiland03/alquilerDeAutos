class Permiso:
    def __init__(self, id_permiso: int, descripcion: str):
        self.id_permiso = id_permiso
        self.descripcion = descripcion
    
    @property
    def id_permiso(self):
        return self._id_permiso

    @id_permiso.setter
    def id_permiso(self, value):
        self._id_permiso = value

    @property
    def descripcion(self):
        return self._descripcion

    @descripcion.setter
    def descripcion(self, value):
        self._descripcion = value
